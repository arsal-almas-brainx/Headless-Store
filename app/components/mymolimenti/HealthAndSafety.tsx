import {Link} from '~/components/Link';

export function HealthAndSafety() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-[60px] lg:py-16">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="mb-8 overflow-hidden rounded-2xl bg-[#f5f5f5]">
          <img
            src="/mymolimenti/health-safety/hairbrushes.png"
            alt="Person holding three black round hairbrushes"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <h2 className="mb-4 font-serif text-[1.75rem] leading-tight text-[#002927]">
          We care about your health and safety.
        </h2>
        <p className="mb-6 text-base leading-relaxed text-[#002927]/80">
          All products offered by MyMolimenti are in line with the EU regulations for each product category. This regulation prioritizes user safety and health. If a customer experiences a serious unexpected reaction after using a product or is otherwise dissatisfied, the first step should always be to contact us directly.
        </p>
        <Link
          to="/pages/sustainability"
          prefetch="intent"
          className="inline-flex items-center justify-center rounded-full bg-[#002927] px-8 py-3 text-base font-medium text-white transition hover:bg-[#001f1d] focus:outline-none focus:ring-2 focus:ring-[#002927] focus:ring-offset-2"
        >
          Read More About Sustainability
        </Link>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
        {/* Left: Image */}
        <div className="overflow-hidden rounded-2xl bg-[#f5f5f5]">
          <img
            src="/mymolimenti/health-safety/hairbrushes.png"
            alt="Person holding three black round hairbrushes"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Right: Content */}
        <div className="flex flex-col">
          <h2 className="mb-4 font-serif text-[2.5rem] leading-tight text-[#002927]">
            We care about your health and safety.
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-[#002927]/80">
            All products offered by MyMolimenti are in line with the EU regulations for each product category. This regulation prioritizes user safety and health. If a customer experiences a serious unexpected reaction after using a product or is otherwise dissatisfied, the first step should always be to contact us directly.
          </p>
          <Link
            to="/pages/sustainability"
            prefetch="intent"
            className="inline-flex items-center justify-center rounded-full bg-[#002927] px-8 py-3 text-base font-medium text-white transition hover:bg-[#001f1d] focus:outline-none focus:ring-2 focus:ring-[#002927] focus:ring-offset-2"
          >
            Read More About Sustainability
          </Link>
        </div>
      </div>
    </section>
  );
}
