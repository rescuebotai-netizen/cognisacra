import React from 'react';

interface IconProps {
    className?: string;
    size?: number | string;
}

// 1. PayPal SVG (exact provided by user)
export const PayPalSvg: React.FC<IconProps> = ({ className = "w-5 h-5", size = "1em" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 256 302" 
        className={className}
    >
        <title>paypal</title>
        <path fill="#27346a" d="M217.168 23.507C203.234 7.625 178.046.816 145.823.816h-93.52A13.39 13.39 0 0 0 39.076 12.11L.136 259.077c-.774 4.87 2.997 9.28 7.933 9.28h57.736l14.5-91.971l-.45 2.88c1.033-6.501 6.593-11.296 13.177-11.296h27.436c53.898 0 96.101-21.892 108.429-85.221c.366-1.873.683-3.696.957-5.477q-2.334-1.236 0 0c3.671-23.407-.025-39.34-12.686-53.765"/>
        <path fill="#27346a" d="M102.397 68.84a11.7 11.7 0 0 1 5.053-1.14h73.318c8.682 0 16.78.565 24.18 1.756a102 102 0 0 1 6.177 1.182a90 90 0 0 1 8.59 2.347c3.638 1.215 7.026 2.63 10.14 4.287c3.67-23.416-.026-39.34-12.687-53.765C203.226 7.625 178.046.816 145.823.816H52.295C45.71.816 40.108 5.61 39.076 12.11L.136 259.068c-.774 4.878 2.997 9.282 7.925 9.282h57.744L95.888 77.58a11.72 11.72 0 0 1 6.509-8.74"/>
        <path fill="#2790c3" d="M228.897 82.749c-12.328 63.32-54.53 85.221-108.429 85.221H93.024c-6.584 0-12.145 4.795-13.168 11.296L61.817 293.621c-.674 4.262 2.622 8.124 6.934 8.124h48.67a11.71 11.71 0 0 0 11.563-9.88l.474-2.48l9.173-58.136l.591-3.213a11.71 11.71 0 0 1 11.562-9.88h7.284c47.147 0 84.064-19.154 94.852-74.55c4.503-23.15 2.173-42.478-9.739-56.054c-3.613-4.112-8.1-7.508-13.327-10.28c-.283 1.79-.59 3.604-.957 5.477"/>
        <path fill="#1f264f" d="M216.952 72.128a90 90 0 0 0-5.818-1.49a110 110 0 0 0-6.177-1.174c-7.408-1.199-15.5-1.765-24.19-1.765h-73.309a11.6 11.6 0 0 0-5.053 1.149a11.68 11.68 0 0 0-6.51 8.74l-15.582 98.798l-.45 2.88c1.025-6.501 6.585-11.296 13.17-11.296h27.444c53.898 0 96.1-21.892 108.428-85.221c.367-1.873.675-3.688.958-5.477q-4.682-2.47-10.14-4.279a83 83 0 0 0-2.77-.865"/>
    </svg>
);

// 2. Zoom SVG (exact provided by user)
export const ZoomSvg: React.FC<IconProps> = ({ className = "w-5 h-5", size = "1em" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 512 512" 
        className={className}
    >
        <title>zoom</title>
        <path fill="#2196f3" d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256s114.6 256 256 256"/>
        <path fill="#fff" fillRule="evenodd" d="M150.2 329.2h169.3V205c0-18.7-15.2-33.9-33.9-33.9H116.4v124.2c0 18.7 15.1 33.9 33.8 33.9M342.1 284l67.7 45.1v-158l-67.7 45.2z"/>
    </svg>
);

// 3. Discord SVG (exact provided by user)
export const DiscordSvg: React.FC<IconProps> = ({ className = "w-5 h-5", size = "1em" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 256 256" 
        className={className}
    >
        <title>discord</title>
        <g fill="none">
            <rect width="256" height="256" fill="#5865f2" rx="60"/>
            <g clipPath="url(#SVGKXSAsd8x)">
                <path fill="#fff" d="M197.308 64.797a165 165 0 0 0-40.709-12.627a.62.62 0 0 0-.654.31c-1.758 3.126-3.706 7.206-5.069 10.412c-15.373-2.302-30.666-2.302-45.723 0c-1.364-3.278-3.382-7.286-5.148-10.412a.64.64 0 0 0-.655-.31a164.5 164.5 0 0 0-40.709 12.627a.6.6 0 0 0-.268.23c-25.928 38.736-33.03 76.52-29.546 113.836a.7.7 0 0 0 .26.468c17.106 12.563 33.677 20.19 49.94 25.245a.65.65 0 0 0 .702-.23c3.847-5.254 7.276-10.793 10.217-16.618a.633.633 0 0 0-.347-.881c-5.44-2.064-10.619-4.579-15.601-7.436a.642.642 0 0 1-.063-1.064a86 86 0 0 0 3.098-2.428a.62.62 0 0 1 .646-.088c32.732 14.944 68.167 14.944 100.512 0a.62.62 0 0 1 .655.08a80 80 0 0 0 3.106 2.436a.642.642 0 0 1-.055 1.064a102.6 102.6 0 0 1-15.609 7.428a.64.64 0 0 0-.339.889a133 133 0 0 0 10.208 16.61a.64.64 0 0 0 .702.238c16.342-5.055 32.913-12.682 50.02-25.245a.65.65 0 0 0 .26-.46c4.17-43.141-6.985-80.616-29.571-113.836a.5.5 0 0 0-.26-.238M94.834 156.142c-9.855 0-17.975-9.047-17.975-20.158s7.963-20.158 17.975-20.158c10.09 0 18.131 9.127 17.973 20.158c0 11.111-7.962 20.158-17.973 20.158m66.456 0c-9.855 0-17.974-9.047-17.974-20.158s7.962-20.158 17.974-20.158c10.09 0 18.131 9.127 17.974 20.158c0 11.111-7.884 20.158-17.974 20.158"/>
            </g>
            <defs>
                <clipPath id="SVGKXSAsd8x">
                    <path fill="#fff" d="M28 51h200v154.93H28z"/>
                </clipPath>
            </defs>
        </g>
    </svg>
);

// 4. Zapier SVG (exact provided by user)
export const ZapierSvg: React.FC<IconProps> = ({ className = "w-5 h-5", size = "1em" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        className={className}
    >
        <title>zapier</title>
        <path fill="#ff4f00" d="M4.157 0A4.15 4.15 0 0 0 0 4.161v15.678A4.15 4.15 0 0 0 4.157 24h15.682A4.15 4.15 0 0 0 24 19.839V4.161A4.15 4.15 0 0 0 19.839 0zm10.61 8.761h.03a.6.6 0 0 1 .23.038a.6.6 0 0 1 .201.124a.63.63 0 0 1 .162.431a.6.6 0 0 1-.162.435a.6.6 0 0 1-.201.128a.6.6 0 0 1-.23.042a.5.5 0 0 1-.235-.042a.6.6 0 0 1-.332-.328a.6.6 0 0 1-.038-.235a.6.6 0 0 1 .17-.431a.6.6 0 0 1 .405-.162m2.853 1.572q.044.005.095.004c.325-.011.646.064.937.219c.238.144.431.355.552.609c.128.279.189.582.185.888v.193a2 2 0 0 1 0 .219h-2.498c.003.227.075.45.204.642a.78.78 0 0 0 .646.265a.7.7 0 0 0 .484-.136a.64.64 0 0 0 .23-.318l.915.257a1.4 1.4 0 0 1-.28.537c-.14.159-.321.284-.521.355a2.2 2.2 0 0 1-.836.136a1.9 1.9 0 0 1-1.001-.245a1.6 1.6 0 0 1-.665-.703a2.2 2.2 0 0 1-.227-1.036a1.95 1.95 0 0 1 .48-1.398a1.9 1.9 0 0 1 1.3-.488m-9.607.023c.162.004.325.026.48.079c.207.065.4.174.563.314c.26.302.393.692.366 1.088v2.276H8.53l-.109-.711h-.065q-.096.245-.272.439a1.1 1.1 0 0 1-.374.264a1 1 0 0 1-.453.083a1.33 1.33 0 0 1-.866-.264a.97.97 0 0 1-.329-.801a1 1 0 0 1 .076-.431a1 1 0 0 1 .242-.363a1.48 1.48 0 0 1 1.043-.303h.952v-.181a.7.7 0 0 0-.136-.454a.55.55 0 0 0-.438-.154a.7.7 0 0 0-.378.086a.48.48 0 0 0-.193.254l-.99-.144a1.26 1.26 0 0 1 .257-.563c.14-.174.321-.302.533-.378c.261-.091.54-.136.82-.129q.078-.006.163-.007m4.384.007c.174 0 .347.038.506.114c.182.083.34.211.458.374c.257.423.377.911.351 1.406a2.53 2.53 0 0 1-.355 1.448a1.15 1.15 0 0 1-1.009.517c-.204 0-.401-.045-.582-.136a1.05 1.05 0 0 1-.48-.457a1.3 1.3 0 0 1-.114-.234h-.045l.004 1.784h-1.059v-4.713h.904l.117.805h.057c.068-.208.177-.401.328-.56a1.13 1.13 0 0 1 .843-.344h.076zm7.559.084h.903l.113.805h.053a1.4 1.4 0 0 1 .235-.484a.8.8 0 0 1 .313-.242a.8.8 0 0 1 .39-.076h.234v1.051h-.401a.66.66 0 0 0-.313.008a.6.6 0 0 0-.272.155a.66.66 0 0 0-.174.26a.7.7 0 0 0-.027.314v1.875h-1.054zm-17.515.003h3.262v.896L3.73 13.104l.034.113h1.973l.042.9H2.4v-.9l1.931-1.754l-.045-.117H2.441zm11.815 0h1.055v3.659h-1.055zm3.443.684l.019.016a.7.7 0 0 0-.351.045a.76.76 0 0 0-.287.204c-.11.155-.174.336-.189.522h1.545c-.034-.526-.257-.787-.74-.787zm-5.718.163c-.026 0-.057 0-.083.004a.8.8 0 0 0-.31.053a.75.75 0 0 0-.257.189a1.02 1.02 0 0 0-.204.695v.064c-.015.257.057.507.204.711a.63.63 0 0 0 .253.196a.64.64 0 0 0 .314.061a.64.64 0 0 0 .578-.265c.14-.223.204-.48.189-.74a1.2 1.2 0 0 0-.181-.711a.68.68 0 0 0-.503-.257m-4.509 1.266a.46.46 0 0 0-.268.102a.37.37 0 0 0-.114.276q0 .08.027.155a.4.4 0 0 0 .087.132a.58.58 0 0 0 .397.11v.004a.86.86 0 0 0 .563-.182a.57.57 0 0 0 .211-.457v-.14z"/>
    </svg>
);

// 5. Google Calendar SVG
export const GoogleCalendarSvg: React.FC<IconProps> = ({ className = "w-5 h-5", size = "1em" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 512 512" 
        className={className}
    >
        <title>google-calendar</title>
        <g fill="none">
            <path fill="#fff" d="M390.736 121.264H121.264v269.472h269.472z"/>
            <path fill="#ea4335" d="M390.736 512L512 390.736l-60.632-10.344l-60.632 10.344l-11.066 55.46z"/>
            <path fill="#188038" d="M0 390.736v80.842C0 493.912 18.088 512 40.42 512h80.844l12.45-60.632l-12.45-60.632l-66.066-10.344z"/>
            <path fill="#1967d2" d="M512 121.264V40.42C512 18.088 493.912 0 471.58 0h-80.844q-11.064 45.108-11.066 66.392q0 21.282 11.066 54.872q40.23 11.52 60.632 11.52T512 121.264"/>
            <path fill="#fbbc04" d="M512 121.264H390.736v269.472H512z"/>
            <path fill="#34a853" d="M390.736 390.736H121.264V512h269.472z"/>
            <path fill="#4285f4" d="M390.736 0H40.422C18.088 0 0 18.088 0 40.42v350.316h121.264V121.264h269.472z"/>
            <path fill="#4285f4" d="M176.54 330.308c-10.072-6.804-17.046-16.74-20.852-29.88l23.378-9.632q3.18 12.126 11.116 18.796c5.254 4.446 11.654 6.636 19.132 6.636q11.467 0 19.704-6.974c5.492-4.648 8.254-10.576 8.254-17.75q0-11.016-8.69-17.988c-5.794-4.648-13.07-6.972-21.76-6.972h-13.508v-23.14h12.126q11.216 0 18.896-6.066c5.12-4.04 7.68-9.566 7.68-16.606c0-6.264-2.29-11.25-6.87-14.988c-4.58-3.74-10.376-5.626-17.416-5.626c-6.872 0-12.87 1.88-17.742 5.626c-4.872 3.74-8.086 9.176-9.642 16.304l-23.08-9.634c3.486-11.472 9.684-20.404 18.59-26.792c8.908-6.388 20.25-9.582 34.028-9.582c14.266 0 26.242 3.328 35.928 9.982c9.686 6.654 14.528 15.688 14.528 27.102c0 9.076-3.326 16.764-9.982 23.064c-6.654 6.302-14.862 10.458-24.622 12.472v1.542c12.33 2.016 22.428 6.942 30.298 14.776c7.87 7.836 11.806 17.842 11.806 30.016c0 14.17-5.596 25.596-16.786 34.278c-11.19 8.682-25.29 13.022-42.3 13.022c-15.684 0-28.718-3.714-39.102-11.144"/>
            <path fill="#4285f4" d="M298.54 340.548V188.75h22.612v151.798z"/>
        </g>
    </svg>
);

// 6. Canva SVG (exact provided by user)
export const CanvaSvg: React.FC<IconProps> = ({ className = "w-5 h-5", size = "1em" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 80 80" 
        className={className}
    >
        <title>canva</title>
        <g fill="none">
            <g clipPath="url(#SVGFqrTtczy)">
                <path fill="#7d2ae7" d="M40 80c22.091 0 40-17.909 40-40S62.091 0 40 0S0 17.909 0 40s17.909 40 40 40"/>
                <path fill="url(#SVGd8hhpebI)" d="M40 80c22.091 0 40-17.909 40-40S62.091 0 40 0S0 17.909 0 40s17.909 40 40 40"/>
                <path fill="url(#SVGXjE8Ac6X)" d="M40 80c22.091 0 40-17.909 40-40S62.091 0 40 0S0 17.909 0 40s17.909 40 40 40"/>
                <path fill="url(#SVG1MVRi0Vl)" d="M40 80c22.091 0 40-17.909 40-40S62.091 0 40 0S0 17.909 0 40s17.909 40 40 40"/>
                <path fill="url(#SVGlcMqmcyN)" d="M40 80c22.091 0 40-17.909 40-40S62.091 0 40 0S0 17.909 0 40s17.909 40 40 40"/>
                <path fill="#fff" d="M57.27 48.205c-.331 0-.622.279-.924.888c-3.414 6.922-9.31 11.82-16.133 11.82c-7.89 0-12.776-7.122-12.776-16.96c0-16.668 9.286-26.304 17.443-26.304c3.811 0 6.139 2.395 6.139 6.207c0 4.524-2.57 6.919-2.57 8.514c0 .716.445 1.15 1.328 1.15c3.55 0 7.715-4.078 7.715-9.84c0-5.585-4.862-9.691-13.018-9.691c-13.48 0-25.46 12.497-25.46 29.788c0 13.384 7.643 22.23 19.436 22.23c12.517 0 19.754-12.454 19.754-16.497c0-.895-.457-1.305-.935-1.305"/>
            </g>
            <defs>
                <radialGradient id="SVGd8hhpebI" cx="0" cy="0" r="1" gradientTransform="rotate(-49.416 84.778 18.66)scale(61.8733)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6420ff"/>
                    <stop offset="1" stopColor="#6420ff" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="SVGXjE8Ac6X" cx="0" cy="0" r="1" gradientTransform="rotate(54.703 1.799 25.019)scale(69.7735)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00c4cc"/>
                    <stop offset="1" stopColor="#00c4cc" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="SVG1MVRi0Vl" cx="0" cy="0" r="1" gradientTransform="rotate(-45.195 92.905 16.89)scale(61.1242 28.1118)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6420ff"/>
                    <stop offset="1" stopColor="#6420ff" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="SVGlcMqmcyN" cx="0" cy="0" r="1" gradientTransform="rotate(66.52 8.14 30.33)scale(62.9836 105.512)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00c4cc" stopOpacity=".726"/>
                    <stop offset="0" stopColor="#00c4cc"/>
                    <stop offset="1" stopColor="#00c4cc" stopOpacity="0"/>
                </radialGradient>
                <clipPath id="SVGFqrTtczy">
                    <path fill="#fff" d="M0 0h80v80H0z"/>
                </clipPath>
            </defs>
        </g>
    </svg>
);

// 7. Stripe Connect Express SVG
export const StripeSvg: React.FC<IconProps> = ({ className = "w-5 h-5", size = "1em" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        className={className}
    >
        <title>stripe</title>
        <rect width="32" height="32" rx="7" fill="#635BFF"/>
        <path fill="#fff" d="M14.654 11.87c0-.98.802-1.36 2.126-1.36 1.905 0 4.298.583 6.22 1.624V6.757C20.89 5.86 18.665 5.5 16.63 5.5c-5.26 0-8.777 2.766-8.777 7.422 0 7.24 9.945 6.074 9.945 9.198 0 1.173-1.026 1.552-2.454 1.552-2.142 0-4.894-.889-7.054-2.112v5.474c2.42 1.04 4.965 1.466 7.054 1.466 5.378 0 9.176-2.658 9.176-7.466 0-7.818-9.87-6.386-9.87-9.294z"/>
    </svg>
);

// 8. Moodle Academic Hub SVG (exact provided by user)
export const MoodleSvg: React.FC<IconProps> = ({ className = "w-5 h-5", size = "1em" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 128 128" 
        className={className}
    >
        <title>moodle</title>
        <radialGradient id="SVGbuAnqd5F" cx="532.855" cy="-537.557" r="209.76" gradientTransform="matrix(1 0 0 -1 -297.6 -460.9)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#faaf40"/>
            <stop offset=".043" stopColor="#f9a538"/>
            <stop offset=".112" stopColor="#f89d31"/>
            <stop offset=".227" stopColor="#f89a2f"/>
            <stop offset=".528" stopColor="#f7922d"/>
            <stop offset="1" stopColor="#f37b28"/>
        </radialGradient>
        <path fill="url(#SVGbuAnqd5F)" d="M106.259 105.754V66.975c0-8.164-3.397-12.244-10.034-12.244c-6.629 0-10.034 4.08-10.034 12.244v38.779H66.294V66.975c0-8.164-3.228-12.244-9.862-12.244c-6.633 0-10.036 4.08-10.036 12.244v38.779H26.667V64.768c0-8.504 2.891-14.801 8.844-19.223c5.102-3.91 12.246-5.777 20.92-5.777c9.015 0 15.478 2.207 19.727 6.801c3.57-4.594 10.207-6.801 19.897-6.801c8.844 0 15.819 1.867 20.922 5.777c5.951 4.422 8.843 10.719 8.843 19.223v41.152h-19.563v-.166z"/>
        <path fill="#58595b" d="m28.539 49.627l-2.041 10.207c18.708 6.291 36.395.166 45.751-16.158c-13.778-9.522-26.535.17-43.71 5.951"/>
        <linearGradient id="SVGcNUTNdEn" x1="324.268" x2="368.932" y1="-509.952" y2="-509.952" gradientTransform="matrix(1 0 0 -1 -297.6 -460.9)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#929497"/>
            <stop offset=".124" stopColor="#757578"/>
            <stop offset=".279" stopColor="#575658"/>
            <stop offset=".44" stopColor="#403e3f"/>
            <stop offset=".609" stopColor="#302d2e"/>
            <stop offset=".788" stopColor="#262223"/>
            <stop offset="1" stopColor="#231f20"/>
        </linearGradient>
        <path fill="url(#SVGcNUTNdEn)" d="M28.539 47.08c-.681 3.91-1.192 7.65-1.872 11.563c17.857 6.125 35.375.85 44.73-15.137c-11.909-13.776-25.17-2.383-42.858 3.574"/>
        <linearGradient id="SVGjd2FkdVL" x1="332.834" x2="351.377" y1="-495.051" y2="-521.534" gradientTransform="matrix(1 0 0 -1 -297.6 -460.9)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#231f20"/>
            <stop offset="1" stopColor="#231f20" stopOpacity="0"/>
        </linearGradient>
        <path fill="url(#SVGjd2FkdVL)" d="M49.799 51.668c-8.164-1.701-17.009 2.555-23.131 6.975c-3.912-28.57 13.777-27.893 36.903-20.75c-1.529 6.975-4.083 16.33-8.502 21.941c-.169-3.744-1.869-6.293-5.27-8.166"/>
        <linearGradient id="SVGeMS1Yb7O" x1="299.778" x2="381.412" y1="-495.802" y2="-495.802" gradientTransform="matrix(1 0 0 -1 -297.6 -460.9)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#929497"/>
            <stop offset=".124" stopColor="#757578"/>
            <stop offset=".279" stopColor="#575658"/>
            <stop offset=".44" stopColor="#403e3f"/>
            <stop offset=".609" stopColor="#302d2e"/>
            <stop offset=".788" stopColor="#262223"/>
            <stop offset="1" stopColor="#231f20"/>
        </linearGradient>
        <path fill="url(#SVGeMS1Yb7O)" d="M2.178 47.08c29.932-18.031 46.77-21.43 81.634-25c-40.478 31.969-41.499 25-81.634 25"/>
        <path fill="none" stroke="#4a4a4c" strokeWidth=".5" d="M83.812 22.246L51.667 45.545"/>
        <path fill="#231f20" d="M45.545 34.66c.34 3.744-.511-3.572 0 0" opacity=".23"/>
        <path fill="none" stroke="#a8abad" strokeWidth=".5" d="m2.178 47.08l49.489-1.535"/>
        <path fill="none" stroke="#f16922" strokeWidth=".5" d="M42.484 35.002C33.98 37.383 6.09 43.506 5.747 47.08c-.849 6.631-.167 17.176-.167 17.176"/>
        <path fill="#f16922" d="M8.131 89.596c-3.063-7.652-6.804-16.158-2.384-26.703C8.64 72.756 8.131 80.24 8.131 89.596"/>
        <path fill="#6d6e70" d="M41.076 33.844c.708-.25 1.384-.17 1.509.184c.126.355-.344.846-1.052 1.096c-.709.256-1.384.172-1.51-.184c-.127-.352.344-.844 1.053-1.096"/>
    </svg>
);

// 8b. Google Classroom SVG (exact provided by user)
export const GoogleClassroomSvg: React.FC<IconProps> = ({ className = "w-5 h-5", size = "1em" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 578.9 500" 
        className={className}
    >
        <title>google-classroom</title>
        <path fill="#0f9d58" d="M52.6 52.6h473.7v394.7H52.6z"/>
        <path fill="#57bb8a" d="M394.7 263.2c16.4 0 29.6-13.3 29.6-29.6S411 204 394.7 204s-29.6 13.3-29.6 29.6s13.3 29.6 29.6 29.6m0 19.7c-31.7 0-65.8 16.8-65.8 37.6v21.6h131.6v-21.6c0-20.8-34.1-37.6-65.8-37.6m-210.5-19.7c16.4 0 29.6-13.3 29.6-29.6S200.5 204 184.2 204s-29.6 13.3-29.6 29.6s13.3 29.6 29.6 29.6m0 19.7c-31.7 0-65.8 16.8-65.8 37.6v21.6H250v-21.6c0-20.8-34.1-37.6-65.8-37.6"/>
        <path fill="#f7f7f7" d="M289.5 236.8c21.8 0 39.5-17.7 39.4-39.5c0-21.8-17.7-39.5-39.5-39.4c-21.8 0-39.4 17.7-39.4 39.5s17.7 39.4 39.5 39.4m0 26.4c-44.4 0-92.1 23.6-92.1 52.6v26.3h184.2v-26.3c0-29.1-47.7-52.6-92.1-52.6"/>
        <path fill="#f1f1f1" d="M342.1 421.1h118.4v26.3H342.1z"/>
        <path fill="#f4b400" d="M539.5 0h-500C17.7 0 0 17.7 0 39.5v421.1C0 482.3 17.7 500 39.5 500h500c21.8 0 39.5-17.7 39.5-39.5v-421C578.9 17.7 561.3 0 539.5 0m-13.2 447.4H52.6V52.6h473.7z"/>
        <path fill="#fff" d="M539.5 0h-500C17.7 0 0 17.7 0 39.5v3.3C0 21 17.7 3.3 39.5 3.3h500C561.3 3.3 579 21 579 42.8v-3.3C578.9 17.7 561.3 0 539.5 0" opacity=".2"/>
        <path fill="#bf360c" d="M539.5 496.7h-500C17.7 496.7 0 479 0 457.2v3.3C0 482.3 17.7 500 39.5 500h500c21.8 0 39.5-17.7 39.5-39.5v-3.3c-.1 21.8-17.7 39.5-39.5 39.5" opacity=".2"/>
        <linearGradient id="SVG3AmffecS" x1="154.865" x2="154.865" y1="295.747" y2="282.634" gradientTransform="matrix(12.992 0 0 -4 -1584.623 1631.087)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#bf360c" stopOpacity=".2"/>
            <stop offset="1" stopColor="#bf360c" stopOpacity=".02"/>
        </linearGradient>
        <path fill="url(#SVG3AmffecS)" d="M460.3 447.4H341.9l52.6 52.6h118.3z"/>
        <path fill="#263238" d="M52.6 49.3h473.7v3.3H52.6z" opacity=".2"/>
        <path fill="#fff" d="M52.6 447.4h473.7v3.3H52.6z" opacity=".2"/>
        <radialGradient id="SVG7ajZce2w" cx="131.401" cy="367.2" r="18.197" gradientTransform="matrix(38.0002 0 0 -38 -4973.328 13965.323)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity=".1"/>
            <stop offset="1" stopColor="#fff" stopOpacity="0"/>
        </radialGradient>
        <path fill="url(#SVG7ajZce2w)" d="M539.5 0h-500C17.7 0 0 17.7 0 39.5v421.1C0 482.3 17.7 500 39.5 500h500c21.8 0 39.5-17.7 39.5-39.5v-421C578.9 17.7 561.3 0 539.5 0"/>
    </svg>
);

// 9. Paymytuition SVG
export const PaymytuitionSvg: React.FC<IconProps> = ({ className = "w-5 h-5", size = "1em" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 256 256" 
        className={className}
    >
        <title>paymytuition</title>
        <rect width="256" height="256" rx="48" fill="#0E4484"/>
        {/* Graduation cap */}
        <path fill="#2CC4C8" d="M128 48L32 96l96 48 80-40v48h16V96z"/>
        <path fill="#2CC4C8" d="M64 128v40c0 35.3 28.7 64 64 64s64-28.7 64-64v-40l-64 32z"/>
        {/* Payment Shield / Dollar Accent */}
        <circle cx="128" cy="172" r="24" fill="#ffffff" opacity="0.95"/>
        <path fill="#0E4484" d="M128 158v28M123 164c0-3 2-5 5-5s5 2 5 5-2 4-5 5-5 2-5 5 2 5 5 5s5-2 5-5"/>
    </svg>
);
