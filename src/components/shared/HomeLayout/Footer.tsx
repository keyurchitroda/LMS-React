import librarylogo from "../../../assets/lmslogo.png";

const Footer = () => {
  return (
    <>
      {" "}
      <footer className="border-t ">
        <div className="item-center justify-between wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
          <div className="gap-1 flex items-center justify-center rounded-lg ">
            <img src={librarylogo} className="w-8 h-8" />{" "}
            <span className="font-bold text-lg bg-primary rounded-lg text-white">
              【ＬＭＳ】
            </span>
            <img src={librarylogo} className="w-8 h-8" />{" "}
          </div>

          <p>2025 LMS. All Rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
