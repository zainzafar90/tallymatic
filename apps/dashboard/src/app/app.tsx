export function App() {
  return (
    <div className="flex mx-auto col-span-1 overflow-x-hidden relative label value !pt-24 md:!pt-52 !pb-24 md:!pb-52">
      <div className="w-full max-w-content px-6 md:px-9 grid mx-auto z-[1] relative gap-x-6 md:gap-x-6 gap-y-6 md:gap-y-6 grid-cols-1 md:grid-cols-1 justify-items-center items-start mobile-desktop:-my-14">
        <div className="w-full">
          <div className="flex justify-center">
            <a
              className="font-medium text-sm leading-5 relative flex items-center gap-1.5 transition-all shadow-elevation-card-rest hover:shadow-elevation-card-hover rounded-full border border-ui-bg-base bg-ui-bg-subtle-hover h-7 pr-2.5 pl-2"
              href="/recap/"
            >
              <div
                className="absolute left-0 top-[-2px]"
                style={{
                  opacity: 0,
                  transform: 'translateX(24.8635px) translateZ(0px)',
                }}
              >
                <div
                  className="absolute top-[1px] right-0 flex items-center justify-center"
                  style={{
                    opacity: '0.75',
                    transform:
                      'scale(1.0774) rotate(159.66deg) translateZ(0px)',
                  }}
                >
                  <img
                    alt="star"
                    loading="lazy"
                    width={16}
                    height={16}
                    decoding="async"
                    data-nimg={1}
                    className="absolute shrink-0 w-4 h-4 min-w-4 min-h-4"
                    src="https://medusajs.com/_next/image/?url=%2Fimages%2Fhero-banner.png&w=3840&q=100"
                    style={{ color: 'transparent' }}
                  />
                </div>
                <svg
                  width={60}
                  height={2}
                  viewBox="0 0 60 2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="0.683594"
                    width="59.6201"
                    height={1}
                    rx="0.5"
                    fill="url(#paint0_linear_13259_339377)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_13259_339377"
                      x1={0}
                      y1="1.18359"
                      x2="59.6201"
                      y2="1.18359"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#F96816" stopOpacity={0} />
                      <stop offset={1} stopColor="#F96816" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span>
                <span className="overflow-hidden">
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.25 1.75V7.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.25 16.25V10.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.25 2.25H8.75C8.19772 2.25 7.75 2.69772 7.75 3.25V6.25C7.75 6.80228 8.19772 7.25 8.75 7.25H15.25C15.8023 7.25 16.25 6.80228 16.25 6.25V3.25C16.25 2.69772 15.8023 2.25 15.25 2.25Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.25 10.75C4.2165 10.75 5 9.9665 5 9C5 8.0335 4.2165 7.25 3.25 7.25C2.2835 7.25 1.5 8.0335 1.5 9C1.5 9.9665 2.2835 10.75 3.25 10.75Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.25 10.75H8.75C8.19772 10.75 7.75 11.1977 7.75 11.75V14.75C7.75 15.3023 8.19772 15.75 8.75 15.75H15.25C15.8023 15.75 16.25 15.3023 16.25 14.75V11.75C16.25 11.1977 15.8023 10.75 15.25 10.75Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
              <span>Medusa 2.0</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col transition-all max-w-[950px] mb-4 text-center">
          <div className="flex relative items-start gap-6 md:gap-4">
            <div className="relative z-[1]">
              <div className="flex items-center w-full gap-3 justify-center">
                <div className="w-full block rte text-xl text-theme-text-primary dark:text-dark-body-primary">
                  <h1 className="font-medium align-middle mb-4 text-[32px] leading-[44px] md:text-[72px] md:leading-[88px]">
                    A commerce platform <br />
                    with a built-in framework <br />
                    for customizations
                  </h1>
                </div>
              </div>
              <div className="rte text-theme-text-secondary dark:text-dark-body-secondary lg:whitespace-pre-wrap">
                <p className="last:mb-0 mb-0 text-xl">
                  The most popular open-source platform for commerce. Use Medusa
                  as your foundation and focus on building the customizations
                  that move the needle.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block w-full">
          <div>
            <div className="[&>span]:flex [&>span]:justify-center [&>span]:gap-2 hidden md:block text-ui-fg-muted font-medium text-sm leading-5 cursor-pointer text-center">
              <span className=" font-light">
                Press{' '}
                <span className="h-5 w-5 rounded-md text-ui-fg-subtle bg-ui-bg-base text-[12px] shadow-elevation-card-rest inline-flex text-center items-center justify-center">
                  S
                </span>{' '}
                anytime to get started
              </span>
            </div>
          </div>
          <div
            hidden
            style={{
              position: 'fixed',
              top: 1,
              left: 1,
              width: 1,
              height: 0,
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0px, 0px, 0px, 0px)',
              whiteSpace: 'nowrap',
              borderWidth: 0,
              display: 'none',
            }}
          />
        </div>
      </div>
      <img
        alt=""
        loading="lazy"
        width={3561}
        height={756}
        decoding="async"
        className="pointer-events-none object-none absolute top-0 z-0 w-full h-full hidden md:block max-w-screen overflow-hidden"
        src="https://medusajs.com/_next/image/?url=%2Fimages%2Fhero-banner.png&w=3840&q=100"
        style={{ color: 'transparent', objectPosition: '50% 0px' }}
      />
    </div>
  );
}

export default App;
