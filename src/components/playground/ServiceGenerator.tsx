import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Bookmark } from 'lucide-react';
import copy from 'copy-to-clipboard';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Bookmark as BookmarkType } from '@shared/types';
type Options = {
  className: string;
  errorHandling: 'result-monad' | 'exceptions';
  useTransaction: boolean;
  sendEmail: boolean;
};
const generateCode = (options: Options): string => {
  const { className, errorHandling, useTransaction, sendEmail } = options;
  const isResultMonad = errorHandling === 'result-monad';
  const callMethod = `
    def call
      ${isResultMonad ? `return OpenStruct.new(success?: false, error: "Invalid Plan") unless valid_plan?` : `raise "Invalid Plan" unless valid_plan?`}
${useTransaction ? `
      ActiveRecord::Base.transaction do
        subscription = @user.subscriptions.create!(plan_id: @plan_id)
        charge_result = PaymentGateway.charge(@payment_method, plan_price)
        unless charge_result.success?
          raise ActiveRecord::Rollback, charge_result.error
        end
${sendEmail ? `
        SubscriptionMailer.welcome(@user).deliver_later` : ''}
        ${isResultMonad ? `OpenStruct.new(success?: true, data: subscription)` : `subscription`}
      end` : `
      subscription = @user.subscriptions.create!(plan_id: @plan_id)
      charge_result = PaymentGateway.charge(@payment_method, plan_price)
      ${isResultMonad ? `return OpenStruct.new(success?: false, error: charge_result.error) unless charge_result.success?` : `raise charge_result.error unless charge_result.success?`}
${sendEmail ? `
      SubscriptionMailer.welcome(@user).deliver_later` : ''}
      ${isResultMonad ? `OpenStruct.new(success?: true, data: subscription)` : `subscription`}`}
    ${isResultMonad ? `rescue StandardError => e
      OpenStruct.new(success?: false, error: e.message)
    end` : `end`}
  `;
  return `
# app/services/subscriptions/${className.toLowerCase()}.rb
module Subscriptions
  class ${className}
    # Standard interface for all services
    def self.call(**args)
      new(**args).call
    end
    def initialize(user:, plan_id:, payment_method:)
      @user = user
      @plan_id = plan_id
      @payment_method = payment_method
    end
${callMethod}
    private
    def valid_plan?
      Plan.exists?(@plan_id)
    end
    def plan_price
      Plan.find(@plan_id).price
    end
  end
end
  `.trim();
};
export function ServiceGenerator() {
  const [options, setOptions] = useState<Options>({
    className: 'CreateSubscription',
    errorHandling: 'result-monad',
    useTransaction: true,
    sendEmail: true,
  });
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();
  const generatedCode = useMemo(() => generateCode(options), [options]);
  const saveBookmarkMutation = useMutation({
    mutationFn: (code: string) => api<BookmarkType>('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ title: `Service Object: ${options.className}`, data: { code, options } }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Generated code saved as a bookmark!');
    },
    onError: (error) => toast.error(`Failed to save: ${error.message}`),
  });
  const handleCopy = () => {
    copy(generatedCode);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Generator Options</CardTitle>
            <CardDescription>Customize the Service Object pattern.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="error-handling">Error Handling</Label>
              <Select
                value={options.errorHandling}
                onValueChange={(value: 'result-monad' | 'exceptions') => setOptions(prev => ({ ...prev, errorHandling: value }))}
              >
                <SelectTrigger id="error-handling">
                  <SelectValue placeholder="Select a pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="result-monad">Result Monad</SelectItem>
                  <SelectItem value="exceptions">Raise Exceptions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="transaction">Use ActiveRecord Transaction</Label>
              <Switch
                id="transaction"
                checked={options.useTransaction}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, useTransaction: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Send Welcome Email</Label>
              <Switch
                id="email"
                checked={options.sendEmail}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, sendEmail: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-8">
        <div className="relative">
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm h-[500px]">
            <code>{generatedCode}</code>
          </pre>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => saveBookmarkMutation.mutate(generatedCode)}>
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}