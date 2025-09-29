import Image from 'next/image';
import Link from 'next/link';

export const K12Section = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-primary text-2xl font-bold mb-2">
          School Education
        </h2>
        <h1 className="text-dark-navy text-[32px] font-bold mb-8 max-w-4xl mx-auto leading-tight">
          Learn and practice school curriculum materials according to national curricula (more than 1,500 videos and 15,000 questions)
        </h1>
        
        <div className="relative rounded-3xl bg-[linear-gradient(135deg,_#264DDB_0%,_#2D60E2_100%)] text-white overflow-hidden p-8 md:p-12 lg:p-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="relative lg:w-1/2 flex justify-center items-center">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/14c4138d-f12b-415d-bee8-dbce5980a4b7-edraak-org/assets/svgs/e427e8539d92d9026baa5ce2625a1a2d-11.svg?"
                alt="Illustration of a student learning on a laptop with educational icons around"
                width={488}
                height={350}
                className="w-full h-auto max-w-[488px]"
              />
            </div>

            <div className="z-10 text-left lg:w-1/2">
              <h2 className="text-4xl font-bold mb-4">
                School Students
              </h2>
              <p className="text-lg mb-8">
                Gain knowledge, track your progress, and enjoy learning!
              </p>
              <Link
                href="/k12"
                className="inline-block bg-white text-primary hover:bg-gray-100 font-bold py-3 px-10 rounded-lg text-lg transition-colors"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};