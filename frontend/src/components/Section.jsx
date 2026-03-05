import React from "react";

const Section = ({ id, title, description, children }) => {
    return (
        <section
            id={id}
            className="w-screen bg-[#011a14] mx-auto px-6 py-28 text-center font-inktrap selection:bg-lime-300 selection:text-emerald-900"
        >
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-200 mb-6">
                {title}
            </h2>

            <p className="text-emerald-100/80 max-w-2xl mx-auto mb-12">
                {description}
            </p>

            {/* Extra custom content */}
            {children}
        </section>
    );
};

export default Section;