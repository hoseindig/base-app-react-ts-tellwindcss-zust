import React from 'react';

const skills = [
    'Vue', 'React', 'TypeScript', 'SASS / SCSS', 'TailwindCSS', 'Styled Components',
    'State Managers (zustand, redux toolkit, Vuex)', 'React Query', 'Node.js', 'Express',
    'REST API', 'PWA', 'Router (React Router / Vue Router)', 'Next.js / Nuxt.js',
    'MongoDB / Mongoose', 'SQL', 'Docker', 'CI/CD', 'Webpack / Vite', 'ESLint / Prettier',
    'Leaflet', 'Chart.js / recharts', 'Accessibility', 'Responsive Design'
];

export default function About() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 md:flex md:items-start gap-6">
                    <div className="flex-shrink-0">
                        <div className="h-28 w-28 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-700">HS</div>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-2">Hossein Sheykhi — Senior Front-End Developer</h1>
                        <p className="text-slate-600 mb-4">
                            Senior Front-End Developer specializing in Vue.js and React.js with extensive experience designing and implementing web applications.
                            I have experience working as a full-stack developer, while focusing on front-end development in recent years. I enjoy continuous learning,
                            solving complex problems, and improving user experience, and I use Node.js extensively in both personal and commercial projects.
                        </p>

                        <div className="mb-4">
                            <h2 className="font-semibold text-slate-800 mb-2">Contact</h2>
                            <p className="text-slate-600">📧 <a href="mailto:hossein.sheykhi.developer@gmail.com" className="text-blue-600 hover:underline">hossein.sheykhi.developer@gmail.com</a></p>
                            <p className="text-slate-600">📞 <a href="tel:+989125771225" className="text-blue-600 hover:underline">09125771225</a></p>
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-800 mb-2">Skills & Technologies</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((s) => (
                                    <span key={s} className="text-sm bg-slate-100 text-slate-800 px-3 py-1 rounded-full shadow-sm">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-sm text-slate-500">
                <p>Short note: I’m focused on front-end excellence, component-driven design, and delivering accessible, responsive interfaces.</p>
            </div>
        </div>
    );
}
