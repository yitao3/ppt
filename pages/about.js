import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* About Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About PPT Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide high-quality, professional PowerPoint templates to help you create stunning presentations with ease.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              Our mission is to empower professionals, educators, and students with beautiful, ready-to-use PowerPoint templates. We believe that great presentations should be accessible to everyone, which is why we offer our templates completely free of charge.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Template Quality</h2>
            <p className="text-gray-600">
              Each template in our collection is carefully designed by professional designers. We ensure that all templates are modern, visually appealing, and optimized for both business and educational presentations.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Downloads</h3>
            <p className="text-gray-600">
              All templates are available for free download. No hidden costs or subscriptions required.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Updates</h3>
            <p className="text-gray-600">
              We regularly add new templates to our collection to keep up with the latest design trends.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Our templates are designed to be user-friendly and easy to customize for your needs.
            </p>
          </div>
        </div>

        {/* Terms Section */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Use</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Our templates are free to use for both personal and commercial purposes. However, please note the following:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>You may not redistribute or resell our templates</li>
              <li>You may not claim our templates as your own work</li>
              <li>You may modify the templates to suit your needs</li>
              <li>Attribution is appreciated but not required</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
} 