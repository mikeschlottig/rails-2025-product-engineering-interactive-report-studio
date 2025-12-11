import { ReportSection } from '@shared/types';
export const reportSections: ReportSection[] = [
  {
    id: 'conclusion-product-vs-data',
    title: '4.4 Conclusion: Product vs. Data',
    excerpt: 'The consensus in 2025 is that Ruby is optimized for Product Engineering, while Python is optimized for Data Engineering. Ruby\'s syntax facilitates "beautiful code" that serves as documentation, whereas Python\'s syntax facilitates the "obvious solution" for computational tasks.',
    fullContent: `
      <p>The consensus in 2025 is that Ruby is optimized for Product Engineering—building complex logic, user-facing features, and DSLs that describe business rules. Python is optimized for Data Engineering—scripting, processing pipelines, and wrapping C/C++ libraries (NumPy/PyTorch).</p>
      <p>Ruby's syntax facilitates the creation of "beautiful code" that serves as documentation, while Python's syntax facilitates the "obvious solution" for computational tasks. This fundamental difference in philosophy dictates where each language shines. Ruby, with Rails, excels in crafting intricate web applications where clarity of business logic is paramount. Python excels in scenarios where performance of numerical computation and data manipulation is the primary concern.</p>
    `,
  },
  {
    id: 'architecture-standards',
    title: '5. Architecture and Engineering Standards in 2025',
    excerpt: 'As Rails applications scale beyond the MVP stage, the default MVC pattern often proves insufficient. In 2025, mature engineering teams adopt specific architectural standards to maintain velocity in large codebases.',
    fullContent: `
      <p>As Rails applications scale beyond the MVP stage, the default MVC pattern (Model-View-Controller) often proves insufficient. The simplicity that makes Rails so powerful for new projects can become a liability as complexity grows. In 2025, mature engineering teams adopt specific architectural standards to maintain velocity, reduce bugs, and improve developer onboarding in large codebases.</p>
    `,
  },
  {
    id: 'service-objects',
    title: '5.1 Service Objects (The Callable Pattern)',
    excerpt: 'The "Fat Model, Skinny Controller" mantra has been superseded by the Service Object pattern. This standard encapsulates business logic into single-purpose classes, preventing "God Objects" and keeping controllers focused on HTTP handling.',
    fullContent: `
      <p>The "Fat Model, Skinny Controller" mantra of the 2010s has been superseded by the Service Object (or Interactor) pattern. This standard encapsulates business logic into single-purpose, plain Ruby objects (POROs). This prevents models from becoming bloated "God Objects" and keeps controllers focused solely on their core responsibility: handling HTTP requests and responses.</p>
      <p><strong>Standard:</strong> The most common implementation in 2025 uses a Callable module to provide a uniform API (<code>.call</code>) and return a Result object (Success/Failure) rather than raising exceptions. This approach, often using monads, makes service outcomes explicit and easy to handle.</p>
      <p><strong>Context:</strong> This pattern decouples the business logic from the web framework. The <code>CreateSubscription</code> service can be called from a Controller, a Background Job, or the Console with identical behavior, greatly improving testability and reusability.</p>
    `,
    codeSample: `
# app/services/subscriptions/create_subscription.rb
module Subscriptions
  class CreateSubscription
    # Standard interface for all services
    def self.call(**args)
      new(**args).call
    end
    def initialize(user:, plan_id:, payment_method:)
      @user = user
      @plan_id = plan_id
      @payment_method = payment_method
    end
    def call
      return OpenStruct.new(success?: false, error: "Invalid Plan") unless valid_plan?
      ActiveRecord::Base.transaction do
        subscription = @user.subscriptions.create!(plan_id: @plan_id)
        charge_result = PaymentGateway.charge(@payment_method, plan_price)
        unless charge_result.success?
          raise ActiveRecord::Rollback, charge_result.error
        end
        SubscriptionMailer.welcome(@user).deliver_later
        OpenStruct.new(success?: true, data: subscription)
      end
    rescue StandardError => e
      OpenStruct.new(success?: false, error: e.message)
    end
    private
    def valid_plan?
      Plan.exists?(@plan_id)
    end
    def plan_price
      Plan.find(@plan_id).price
    end
  end
end
    `,
  },
  {
    id: 'hexagonal-architecture',
    title: '5.2 Hexagonal Architecture (Ports and Adapters)',
    excerpt: 'For enterprise-grade Rails applications, Hexagonal Architecture is increasingly adopted to isolate the core domain from external inputs and outputs, drastically improving test speed and maintainability.',
    fullContent: `
      <p>For enterprise-grade Rails applications (e.g., at Shopify or fintech startups), Hexagonal Architecture is increasingly adopted to isolate the core domain from external inputs and outputs. This allows the application to be tested without loading the entire Rails framework, drastically improving test speed.</p>
      <p><strong>Implementation Detail:</strong> The "Core" does not depend on Rails. The infrastructure layer depends on Rails and the Core. This inversion of control ensures that a change in a database library or an external API does not require refactoring the business rules.</p>
    `,
    codeSample: `
# Folder Structure Example for Hexagonal Rails
app/
���── controllers/      # Adapter: Driving (HTTP)
├── jobs/             # Adapter: Driving (Async)
├── core/             # The Hexagon (Pure Domain Logic)
│   ├── billing/      # Context
│   │   ├── domain/   # Entities (Pure Ruby Objects)
│   │   ├── use_cases/ # Interactors (Application Logic)
│   │   └── ports/    # Interfaces (Repositories/Gateways)
└── infrastructure/   # Adapter: Driven
    ├── repositories/ # ActiveRecord implementations of Ports
    ├── gateways/     # Stripe/PayPal API wrappers
    └── mailers/      # ActionMailer implementations
    `,
  },
  {
    id: 'linting',
    title: '5.3 Linting: RuboCop Omakase vs. StandardRB',
    excerpt: 'Code style consistency is strictly enforced in 2025. The community is split between two dominant configurations: RuboCop Omakase (Rails default) and StandardRB (strict, zero-configuration).',
    fullContent: `
      <p>Code style consistency is strictly enforced in 2025 pipelines. The community is split between two dominant configurations:</p>
      <ul>
        <li><strong>RuboCop Omakase:</strong> The default configuration shipped with Rails 8. It represents DHH's preferred style (double quotes, relaxed whitespace). It is designed to be "good enough" for most, reducing the need for configuration.</li>
        <li><strong>StandardRB:</strong> A strict, zero-configuration wrapper around RuboCop. Adopted by consultancies and teams that want to eliminate "bikeshedding" (debates over style). If you use StandardRB, you accept its rules; there is no configuration file to tweak. This is becoming the preferred choice for teams prioritizing stability and conformity.</li>
      </ul>
    `,
    codeSample: `
# Gemfile Integration
group :development, :test do
  # Choose one:
  gem "rubocop-rails-omakase", require: false # The Rails Way
  # OR
  gem "standard", require: false              # The Strict Way
end
    `,
  },
  {
    id: 'testing',
    title: '5.4 Testing: RSpec vs. Minitest',
    excerpt: 'The testing framework debate remains active. Minitest is the fast, simple Rails default, while RSpec is the expressive, BDD-focused industry standard for employment.',
    fullContent: `
      <p>The testing framework debate remains active, reflecting the diversity of the ecosystem.</p>
      <ul>
        <li><strong>Minitest:</strong> The Rails default. Used by 37signals and Shopify. It is fast, uses standard Ruby syntax (<code>class UserTest < ActiveSupport::TestCase</code>), and requires zero setup. It is preferred for the "One Person Framework" approach where speed is paramount.</li>
        <li><strong>RSpec:</strong> The industry standard for employment. Used by the majority of consultancies and large enterprises. Its BDD syntax (<code>describe, it, expect</code>) reads like documentation and provides powerful mocking capabilities (RSpec Mocks). While slower to boot, its expressiveness helps communicate business requirements.</li>
      </ul>
      <p><strong>Insight:</strong> Startups often begin with Minitest for velocity but migrate to RSpec as the team grows and the need for detailed behavioral specifications increases.</p>
    `,
  },
  {
    id: 'case-studies',
    title: '6. Engineering Products with Ruby: Case Studies',
    excerpt: 'The viability of Ruby on Rails in 2025 is best evidenced by the scale and complexity of the products built upon it. Companies like Shopify, GitHub, and 37signals demonstrate that Rails is for massive scale, not just MVPs.',
    fullContent: `
      <p>The viability of Ruby on Rails in 2025 is best evidenced by the scale and complexity of the products built upon it. These companies demonstrate that Rails is not just for MVPs but for massive scale.</p>
      <h3>6.1 Shopify: The Modular Monolith</h3>
      <p>Shopify is the largest Rails codebase in the world. Their engineering strategy rejects microservices in favor of a Modular Monolith. They use a tool called <code>packwerk</code> to enforce strict boundaries between domains (e.g., Inventory, Billing, Shipping) within the single repo. Shopify handles Black Friday/Cyber Monday traffic (millions of requests per minute) on Rails and is the primary driver behind YJIT, which has improved Ruby's performance by over 40%.</p>
      <h3>6.2 GitHub: Continuous Modernization</h3>
      <p>GitHub runs on a monolithic Rails application that is continuously upgraded, often running off the main development branch. This strategy prevents technical debt and ensures they leverage the latest performance improvements immediately. They map every line of code to a "Service Owner" team to manage accountability.</p>
      <h3>6.3 37signals (Basecamp & HEY): The Deployment Pioneers</h3>
      <p>As the birthplace of Rails, 37signals continues to innovate. They migrated HEY and Basecamp off AWS to bare-metal servers using Kamal, saving millions. They utilize the pure "Solid" stack—SQLite/MySQL for everything, including jobs and caching, proving high-performance applications can be built without the complexity of Kubernetes.</p>
    `,
  },
  {
    id: 'recommendations',
    title: '7. Strategic Recommendations',
    excerpt: 'Embrace the monolith, adopt the "Solid" stack, deploy with Kamal, use Hotwire pragmatically, and standardize style with StandardRB. These are the key recommendations for engineering leaders in 2025.',
    fullContent: `
      <p>Based on the research and current trends, the following recommendations are made for engineering leaders in 2025:</p>
      <ol>
        <li><strong>Embrace the Monolith:</strong> Do not prematurely split applications into microservices. Use Service Objects and Packwerk to modularize the codebase while keeping deployment simple.</li>
        <li><strong>Adopt the "Solid" Stack:</strong> For new Rails 8 applications, utilize Solid Queue and Solid Cache backed by the database. Avoid introducing Redis until scale explicitly demands it.</li>
        <li><strong>Deploy with Kamal:</strong> Evaluate the cost savings of deploying to VPS/Bare Metal using Kamal versus managed PaaS solutions.</li>
        <li><strong>Frontend Pragmatism:</strong> Default to Hotwire for 90% of the UI. Reserve React (via Vite) only for high-fidelity components that require complex local state management.</li>
        <li><strong>Standardize Style:</strong> Adopt StandardRB to eliminate friction in code reviews and enforce consistent engineering practices.</li>
      </ol>
      <p>In conclusion, Ruby on Rails in 2025 offers a unique value proposition: it is the only major framework that provides a cohesive, integrated answer to every layer of the stack. Its renaissance as a comprehensive ecosystem makes it arguably the most efficient tool for building software businesses.</p>
    `,
  },
];