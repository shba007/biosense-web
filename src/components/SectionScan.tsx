import Image from 'next/image';
import { useRef, useState } from 'react';
import Compressor from 'compressorjs';
import { ofetch } from 'ofetch';

function compress(image: File) {
  return new Promise<Blob>(
    (resolve, resject) =>
      new Compressor(image, {
        quality: 0.9,
        maxWidth: 2048,
        maxHeight: 2048,
        success(result) {
          resolve(result);
        },
        error(err) {
          resject(err);
        },
      })
  );
}

function imageBlobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (e) => {
      resolve(e.target!.result as string);
    };
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

export default function SectionScan({}) {
  const snapshot = useRef<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diseases, setDiseases] = useState<{ disease: string; prob: number }[]>(
    []
  );

  async function detect(imageBlob: Blob) {
    setIsLoading(true);

    try {
      const response = await ofetch<[{ disease: string; prob: number }]>(
        '/detect',
        {
          baseURL: '/api',
          method: 'POST',
          body: { image: await imageBlobToBase64(imageBlob) },
        }
      );

      setDiseases(response.sort((a, b) => b.prob - a.prob));
    } catch (error) {
      console.error('Detection Error', error);
    }

    setIsLoading(false);
  }

  async function select(files: File[]) {
    if (!snapshot) return;

    const imageBlob = await compress(files[0]);
    const url = URL.createObjectURL(imageBlob);
    snapshot.current!.src = url;
    detect(imageBlob);
  }

  return (
    <section>
      <div className="mx-auto rounded-xl w-full max-w-2xl aspect-[4/3] sm:aspect-[16/9] bg-primary-400/50 shadow-[0px_2px_18px_0px_rgba(0,0,0,0.15)_inset] overflow-hidden">
        <img ref={snapshot} className="w-full h-full object-contain" />
      </div>
      <label
        htmlFor="image"
        className={`flex justify-center items-center gap-1 mx-auto my-8
         px-4 py-4 rounded-full h-fit w-fit bg-[#FBFDFF] shadow-button cursor-pointer`}
      >
        <Image
          src={`/icons/${isLoading ? 'loader' : 'scanner'}.svg`}
          alt="scanner"
          width={24}
          height={24}
        />
        <span>Scan Disease</span>
      </label>
      <input
        id="image"
        type="file"
        name="image"
        accept="image/*"
        className="hidden"
        onChange={($event: any) => select($event!.target!.files)}
      />
      <ul className="flex flex-col">
        {diseases.map(({ disease, prob }) => (
          <li className="flex justify-between" key={disease}>
            <span className="capitalize">{disease}</span>
            <span>{prob.toFixed(2)} %</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
