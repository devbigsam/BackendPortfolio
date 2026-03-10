// import HeroImg from "@/assets/images/hero.png";
// import 'your image name' from "@/assets/images/your-image";

export default function About() {
  return (
    <>
      <section id="about" className="py-16 md:py-32  text-white bg-[#04081A]">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
          <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl text-white">
            Developer, Designer, Creator, Problem Solver
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
  <div className="relative rounded-2xl overflow-hidden">
    <img
      src="https://i.ibb.co/kszZzctB/IMG-5586.jpg"
      className="w-full h-auto block"
      alt="hero"
    />
  </div>
</div>


            <div className="relative space-y-4">
              <p className="text-white">
                Hello! My name is Samuel Ndubuisi, a blockchain developer so passionate about the future of web3 in the decentralized industry. Started my journey as a web developer
                specializing in creating innovative web solutions and
                user-friendly interfaces for web3 projects and launches. But as time comes by, I realized that there's more to becoming a blockchain developer, than mere web dev alone.{" "}
                <span className="font-bold text-white">
                  As an  Enthusiast, and someone with a nack for good UI Framework
                </span>
                , I'm dedicated to simplifying development workflows.
              </p>
              <p className="text-white">
                With a good problem solving foundation, I have streamlined my focus to developing real world blockchain assets, utilities, and making some of this progress
                accessible to all developers. Currently, I'm expanding my knowledge as I am working on a blockchain marketplace, where users can sell and buy rare collections at the same time. I am dedicated to making this platform a 
                seamless, robust, and user friendly web application.
              </p>

              <div className="pt-6">
                <blockquote className="border-l-4 border-gray-300 pl-4">
                  <p className="text-white">
I’m Samuel, a Blockchain Developer Delivering real-world results through innovative problem-solving, polished execution, and versatile expertise across Web3, digital media, and product development.
If you’d like, I can share my portfolio or a live demo.
Looking forward to collaborating with you.

                  </p>

                  <div className="mt-6 space-y-3">
                    <cite className="block font-medium text-white">
                      Best Regards, <br></br>
                      Samuel Ndubuisi
                    </cite>
                   
                  </div>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
