const Hero = ({ title, imgUrl, description, input }) => {
  return (
    <div className="hero">
      <h1>{title}</h1>
      <img src={imgUrl} alt={title} />
      <p dangerouslySetInnerHTML={{ __html: description }} />
      {input}
    </div>
  );
};

export default Hero;
