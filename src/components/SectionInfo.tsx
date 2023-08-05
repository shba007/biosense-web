function formatExponent(number: number) {
  // Get the exponent part using toExponential() and split it
  const [coefficient, exponent] = number.toExponential().split('e');

  // Format the coefficient part to remove trailing zeros
  const formattedCoefficient = parseFloat(coefficient).toFixed(1);

  // Format the exponent part to remove leading zeros and add a plus sign if needed
  const formattedExponent = parseInt(exponent)
    .toString()
    .replace(/^(-)?0+/, (match, p1) => (p1 ? '-0' : ''));
  const sign = formattedExponent.startsWith('-') ? '-' : '';

  return (
    <span className="relative mr-2">
      {formattedCoefficient} x 10
      <span className="absolute -top-1 -right-2 text-sm">
        {sign}
        {Number.isNaN(Math.abs(parseInt(formattedExponent)))
          ? 0
          : Math.abs(parseFloat(formattedExponent))}
      </span>
    </span>
  );
}

export default function SectionInfo({
  luminosity,
  temperature,
  humidity,
  moisture,
}: {
  luminosity: number;
  temperature: number;
  humidity: number;
  moisture: number;
}) {
  return (
    <section>
      <div>
        <h1 className="text-[2rem] font-semibold">Aloe Vera</h1>
        <h2 className="text-base font-medium opacity-40">
          Aloe barbadensis miller
        </h2>
      </div>
      <div className="relative flex justify-between mt-4 w-[calc(100vw-1rem)] md:w-[calc(100vw-2rem)] overflow-y-visible">
        <ul className="flex flex-col gap-6">
          <li className="flex flex-col font-medium">
            <span className="opacity-40">Age</span>
            <span className="text-2xl">2 Week</span>
          </li>
          <li className="flex flex-col font-medium">
            <span className="opacity-40">Luminosity</span>
            <span className="text-2xl">
              {formatExponent(luminosity ?? 0)} lux
            </span>
          </li>
          <li className="flex flex-col font-medium">
            <span className="opacity-40">Temperature</span>
            <span className="text-2xl">{temperature.toFixed(1)} °C</span>
          </li>
          <li className="flex flex-col font-medium">
            <span className="opacity-40">Humidity</span>
            <span className="text-2xl">{humidity.toFixed(1)} %</span>
          </li>
          <li className="flex flex-col font-medium">
            <span className="opacity-40">Soil Moisture</span>
            <span className="text-2xl">{moisture.toFixed(1)} %</span>
          </li>
        </ul>
        <div className="relative w-[200px] sm:w-[400px] h-[400px] overflow-x-hidden">
          <div className="absolute sm:absolute left-full sm:right-0 bottom-0 -translate-x-[45%] sm:-translate-x-full w-[200%] sm:w-full h-full">
            <div className="w-full h-full rounded-full bg-[#CEDFF7] absolute shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)_inset]"></div>
            <div className="w-[75%] aspect-square rounded-full bg-[#CEDFF7] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)_inset]"></div>
            <div className="w-[50%] aspect-square rounded-full bg-[#CEDFF7] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)_inset]"></div>
            <div className="relative w-full h-full rounded-b-[50%] overflow-hidden ">
              <img
                src="images/aloe-vera.png"
                alt="aloe-vera"
                className="md:mx-auto w-full object-contain -translate-x-[22.5%] sm:translate-x-0 -translate-y-[2.5%] md:-translate-y-[5%] scale-[80%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
