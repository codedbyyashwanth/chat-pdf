import * as React from "react"
import { Button } from "@/components/ui/button"

/**
 * Example PdfUploadSection replicating the design from your screenshot.
 */
export function PdfUploadSection() {
  return (
    <section
      className="
        relative 
        flex 
        min-h-screen 
        flex-col 
        items-center 
        justify-center 
        bg-background 
        px-4 
        py-16
      "
    >
      {/* Purple arrow in the top-right corner (absolute) */}
      <div className="pointer-events-none absolute top-8 right-8 hidden md:block">
        {/* A simple arrow svg pointing at the box. 
            Feel free to tweak strokeWidth, transform, etc. */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transform rotate-[20deg]"
        >
          <path d="M15 60c15-10 30-10 45-10" />
          <path d="M45 50l15 0 0 15" />
          {/* Optional text near the arrow—if you want the “Drag & drop here” label */}
          <text
            x="55"
            y="40"
            fill="#7C3AED"
            fontSize="10"
            fontWeight="bold"
            textAnchor="start"
            transform="rotate(-20 55,40)"
          >
            drag & drop your PDF file here
          </text>
        </svg>
      </div>

      {/* Heading */}
      <h1
        className="
          scroll-m-20 
          text-4xl 
          font-extrabold 
          leading-tight 
          tracking-tight 
          text-foreground 
          sm:text-5xl
        "
      >
        Chat with any PDF
      </h1>

      {/* Subheading */}
      <p className="mt-3 max-w-xl text-center text-muted-foreground sm:text-lg">
        Join millions of students, researchers and professionals to instantly
        answer questions and understand research with AI
      </p>

      {/* Dashed Upload Box */}
      <div
        className="
          mt-8
          flex
          w-full
          max-w-2xl
          flex-col
          items-center
          justify-center
          rounded-md
          border-2
          border-dashed
          border-gray-300
          bg-background
          px-8
          py-12
          text-center
          dark:border-gray-700
        "
      >
        {/* Plus icon in a gray circle (optional) */}
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-gray-100
            dark:bg-background
          "
        >
          <svg
            className="h-6 w-6 text-gray-500 dark:text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Click to upload, or drag PDF here
        </p>

        <Button
          className="
            mt-6
            bg-purple-600 
            text-white 
            hover:bg-purple-700 
            dark:bg-purple-600 
            dark:hover:bg-purple-700
          "
          size="lg"
        >
          Upload PDF
        </Button>
      </div>
    </section>
  )
}
