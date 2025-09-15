import React from "react"; 

interface LoaderProps {
additionalText?: string
}

const Loader: React.FC<LoaderProps> = React.memo(({ additionalText }) => {
    return (
        <section className="absolute w-screen h-screen flex justify-center items-center backdrop-blur-sm z-10 text-gray-800">
            Loading{additionalText && " " + additionalText}...
        </section>
    )
}); 

export default Loader;