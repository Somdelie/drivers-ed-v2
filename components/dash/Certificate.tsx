"use client";
import React from "react";
import { QRCodeSVG } from "qrcode.react";

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
    <div className="w-full py-1 flex items-start justify-items-start">
      <svg
        viewBox="0 0 800 600"
        className="w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background Image */}
        <image href="/c-bg1.png" width="800" height="600" />

        {/* Student Name */}
        <text
          x="400"
          y="177"
          textAnchor="middle"
          className="text-2xl opacity-80 sm:text-3xl text-[#000000] certificate-name"
        >
          {studentName}
        </text>

        {/* Student ID */}
        <text
          x="400"
          y="205"
          textAnchor="middle"
          className="sm:text-xl text-[#040404] certificate-name"
        >
          ({studentId})
        </text>

        {/* Marks */}
        <text
          x="400"
          y="355"
          textAnchor="middle"
          className="text-2xl font-bold opacity-75 sm:text-3xl certificate-name"
        >
          {result}%
        </text>

        {/* Date */}
        <text
          x="400"
          y="410"
          textAnchor="middle"
          className="text-2xl font-bold opacity-75 sm:text-3xl text-[#000000] certificate-name"
        >
          {date}
        </text>

        {/* QR Code */}
        <foreignObject x="350" y="430" width="100" height="100">
          <QRCodeSVG
            value={
              qrCodeValue ||
              `http://localhost:3000/certificates/verify/${certificateId}`
            }
            size={100}
            level="H"
            bgColor="transparent"
          />
        </foreignObject>

        {/* City and Instructor */}
        <text x="220" y="545" className="text-sm font-semibold sm:text-base">
          <tspan x="220">City:</tspan>
          <tspan x="297">{city}</tspan> {/* Adjust x to align properly */}
        </text>
        <text x="220" y="560" className="text-sm font-semibold sm:text-base">
          <tspan x="220">Instructor:</tspan>
          <tspan x="300">{instructor}</tspan> {/* Adjust x to align properly */}
        </text>

        {/* Certificate validity text */}
        <text x="220" y="580" className="text-xs font-bold">
          This certificate is valid for a period of 12 months
        </text>
      </svg>
    </div>
  );
};

export default Certificate;
