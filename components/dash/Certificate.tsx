"use client";
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Montserrat } from "next/font/google";

// Define the prop types for TypeScript
interface CertificateProps {
  studentName?: string;
  studentId?: string;
  date?: string;
  city?: string;
  instructor?: string;
  result?: string;
  certificateId?: string;
  certificateType?: string;
  qrCodeValue?: string;
}

const montserrat = Montserrat({ subsets: ["latin"], weight: "700" });

const Certificate: React.FC<CertificateProps> = ({
  studentName = "",
  studentId = "",
  date = "",
  city = "",
  instructor = "",
  result = "",
  certificateId = "",
  certificateType = "Driver Risk Assessment",
  qrCodeValue = "",
}) => {
  return (
    <svg
      viewBox="0 0 800 600"
      className="w-full h-auto max-w-4xl mx-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Image */}
      <image href="/c-bg1.png" width="800" height="600" />

      {/* Student Name */}
      <text
        x="400"
        y="177"
        textAnchor="middle"
        className={
          "text-xl opacity-80 capitalize sm:text-2xl text-[#000000]" +
          " " +
          montserrat.className
        }
      >
        {studentName}
      </text>

      {/* Student ID */}
      <text
        x="400"
        y="198"
        textAnchor="middle"
        className={
          "opacity-85 text-xl text-[#000000]" + " " + montserrat.className
        }
      >
        {studentId}
      </text>

      {/* Marks */}
      <text
        x="400"
        y="355"
        textAnchor="middle"
        className="text-xl font-bold opacity-75 sm:text-2xl certificate-name"
      >
        {result}%
      </text>

      {/* Date */}
      <text
        x="400"
        y="410"
        textAnchor="middle"
        className={
          "text-xl font-bold opacity-75 sm:text-2xl text-[#000000]" +
          " " +
          montserrat.className
        }
      >
        {date}
      </text>

      {/* QR Code */}
      <foreignObject x="356" y="430" width="150" height="150">
        <QRCodeSVG
          value={
            qrCodeValue ||
            `http://localhost:3000/certificates/verify/${certificateId}`
          }
          size={86}
          level="H"
          bgColor="transparent"
        />
      </foreignObject>

      {/* City and Instructor */}
      <text x="220" y="545" className="text-xs font-semibold sm:text-sm">
        <tspan x="220">City:</tspan>
        <tspan x="297">{city}</tspan> {/* Adjust x to align properly */}
      </text>
      <text x="220" y="560" className="text-xs font-semibold sm:text-sm">
        <tspan x="220">Instructor:</tspan>
        <tspan x="300">{instructor}</tspan> {/* Adjust x to align properly */}
      </text>

      {/* Certificate validity text */}
      <text x="220" y="580" className="text-[8px] font-bold">
        This certificate is valid for a period of 12 months
      </text>
    </svg>
  );
};

export default Certificate;
