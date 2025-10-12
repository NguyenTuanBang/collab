const Banner = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <img
        src="/productbanner.webp"
        alt="Banner"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Banner;
