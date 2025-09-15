import React from "react";

const Footer: React.FC = React.memo(() => {
  return (
    <section className="w-full h-8 p-6 flex justify-center items-center border-t border-gray-200">
      <p className="text-gray-600 font-[Poppins]">2025 AI Code Reviewer</p>
    </section>
  );
});

export default Footer;
