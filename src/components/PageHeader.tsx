
import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  image?: string;
  overlay?: boolean;
  children?: ReactNode;
}

const PageHeader = ({ 
  title, 
  description, 
  image = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", 
  overlay = true,
  children 
}: PageHeaderProps) => {
  return (
    <div className="relative">
      <div 
        className="h-72 md:h-96 bg-cover bg-center" 
        style={{ backgroundImage: `url(${image})` }}
      >
        {overlay && <div className="absolute inset-0 bg-black bg-opacity-40"></div>}
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-white text-lg md:text-xl max-w-2xl">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
