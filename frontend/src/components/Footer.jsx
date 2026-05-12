const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div>
            <h2 className="text-white text-2xl font-bold">
              TravelGenie
            </h2>

            <p className="text-gray-400 mt-2">
              AI Powered Smart Travel Planning Platform
            </p>
          </div>

          <div className="flex gap-8 text-gray-400 text-sm">

            <span className="hover:text-white cursor-pointer transition">
              Privacy
            </span>

            <span className="hover:text-white cursor-pointer transition">
              Terms
            </span>

            <span className="hover:text-white cursor-pointer transition">
              Support
            </span>

          </div>

        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
          © 2026 TravelGenie. All rights reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;