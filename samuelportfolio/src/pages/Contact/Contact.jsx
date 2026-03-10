import React, { useState } from "react";
import { Send, Phone, MapPin, Mail } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaTelegramPlane, FaDiscord, FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+234",
    phoneNumber: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);

  const countryCodes = [
    { code: "+1", country: "US/CA", length: 10 },
    { code: "+44", country: "UK", length: 10 },
    { code: "+91", country: "IN", length: 10 },
    { code: "+234", country: "NG", length: 10 },
    { code: "+254", country: "KE", length: 9 },
    { code: "+27", country: "ZA", length: 9 },
    { code: "+971", country: "AE", length: 9 },
    { code: "+966", country: "SA", length: 9 },
    { code: "+20", country: "EG", length: 10 },
    { code: "+33", country: "FR", length: 9 },
    { code: "+49", country: "DE", length: 10 },
    { code: "+81", country: "JP", length: 10 },
    { code: "+86", country: "CN", length: 11 },
    { code: "+7", country: "RU", length: 10 },
    { code: "+55", country: "BR", length: 11 },
    { code: "+61", country: "AU", length: 9 },
  ];

  const onVerifyCaptcha = (token) => {
    setCaptchaToken(token);
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }

    if (formData.phoneNumber.trim()) {
      const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
      if (selectedCountry) {
        const cleanNumber = formData.phoneNumber.replace(/\s/g, '');
        if (cleanNumber.length !== selectedCountry.length || !/^\d+$/.test(cleanNumber)) {
          tempErrors.phoneNumber = `Phone number must be ${selectedCountry.length} digits for ${selectedCountry.country}`;
          isValid = false;
        }
      }
    }

    if (!formData.subject.trim()) {
      tempErrors.subject = "Subject is required";
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("Please fill in all required fields correctly.");
      return;
    }

    if (!captchaToken) {
    setStatus("Please complete the captcha verification.");
    return;
    }

    // Create a new FormData object to send to Web3Forms API
    const form = new FormData();
    form.append("access_key", "542685b1-52f7-449c-bd07-0ff7c16c5f4c"); // Replace with your Web3Forms access key
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("whatsapp", formData.countryCode + formData.phoneNumber);
    form.append("subject", formData.subject || "New Contact Form Submission");
    form.append("message", formData.message);
    form.append("h-captcha-response", captchaToken);

    try {
      // Send form data to Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Message sent successfully!");

        setFormData({
          name: "",
          email: "",
          countryCode: "+234",
          phoneNumber: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        setStatus(result.message || "There was an error sending your message.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <main
      className="pt-20 lg:pt-[0rem] bg-[#04081A]
 text-white min-h-screen pb-20"
    >
      <section className="hero min-h-screen flex items-center relative px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Get in Touch
                </h2>
                <p className="text-gray-300 text-lg">
                  Have a question or want us to work together ? Drop me a message!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-500/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-400">samuelndubuisi54@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-pink-500/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-gray-400"> Abuja</p>
                  </div>
                </div>
              </div>

              {/* Quick Links Section */}
              <Card className="group relative overflow-hidden bg-gray-900/80 border-gray-700 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(100,100,255,0.1)] to-transparent group-hover:via-[rgba(100,100,255,0.2)] animate-shimmer"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-gray-800/50 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                      Quick Links
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://t.me/devbigsam" target="_blank" rel="noopener noreferrer">
                      <Badge
                        variant="outline"
                        className="group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                      >
                        <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                          <FaTelegramPlane className="w-4 h-4 text-blue-400" />
                        </span>
                        <span className="font-medium">Telegram</span>
                      </Badge>
                    </a>
                    <a href="https://discord.gg/FjeXcnBg" target="_blank" rel="noopener noreferrer">
                      <Badge
                        variant="outline"
                        className="group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                      >
                        <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                          <FaDiscord className="w-4 h-4 text-indigo-400" />
                        </span>
                        <span className="font-medium">Discord</span>
                      </Badge>
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                      <Badge
                        variant="outline"
                        className="group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                      >
                        <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                          <FaLinkedin className="w-4 h-4 text-blue-600" />
                        </span>
                        <span className="font-medium">LinkedIn</span>
                      </Badge>
                    </a>
                    <a href="https://twitter.com/devbigsam" target="_blank" rel="noopener noreferrer">
                      <Badge
                        variant="outline"
                        className="group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                      >
                        <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                          <FaTwitter className="w-4 h-4 text-sky-400" />
                        </span>
                        <span className="font-medium">Twitter</span>
                      </Badge>
                    </a>
                    <a href="https://github.com/devbigsam" target="_blank" rel="noopener noreferrer">
                      <Badge
                        variant="outline"
                        className="group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                      >
                        <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
                          <FaGithub className="w-4 h-4 text-gray-300" />
                        </span>
                        <span className="font-medium">GitHub</span>
                      </Badge>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-xl lg:mt-16 border-2 border-blue-400">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                        errors.name ? "border-red-500" : "border-gray-700"
                      } focus:border-blue-500 focus:outline-none transition-colors`}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                        errors.email ? "border-red-500" : "border-gray-700"
                      } focus:border-blue-500 focus:outline-none transition-colors`}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">WhatsApp (optional)</label>
                    <div className="flex gap-2">
                      <select
                        className={`px-3 py-3 rounded-lg bg-white/5 border ${
                          errors.phoneNumber ? "border-red-500" : "border-gray-700"
                        } focus:border-blue-500 focus:outline-none transition-colors text-white`}
                        value={formData.countryCode}
                        onChange={(e) =>
                          setFormData({ ...formData, countryCode: e.target.value })
                        }
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code} className="bg-gray-800">
                            {country.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        className={`flex-1 px-4 py-3 rounded-lg bg-white/5 border ${
                          errors.phoneNumber ? "border-red-500" : "border-gray-700"
                        } focus:border-blue-500 focus:outline-none transition-colors`}
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Subject <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Enter the subject of your message"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                        errors.subject ? "border-red-500" : "border-gray-700"
                      } focus:border-blue-500 focus:outline-none transition-colors`}
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Message <span className="text-red-500">*</span></label>
                    <textarea
                      placeholder="Enter your message here"
                      rows="4"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                        errors.message ? "border-red-500" : "border-gray-700"
                      } focus:border-blue-500 focus:outline-none transition-colors resize-none`}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                <HCaptcha
                  sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2" // Replace with your hCaptcha site key. Leave as is unless you are on a paid plan.
                  onVerify={onVerifyCaptcha}
                  theme="dark"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-black-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Status Message */}
              {status && (
                <div
                  className={`mt-4 text-center ${
                    status.includes("success")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  <p>{status}</p>
                </div>
                
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Success Popup */}
{status === "Message sent successfully!" && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
    <div className="bg-[#0B0F1F] border-2 border-blue-400 rounded-2xl p-10 text-center shadow-2xl animate-popup">

      {/* Repeating Animated Tick */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-400 rounded-full flex items-center justify-center animate-scale-loop">
            <svg
              className="w-12 h-12 text-blue-400 animate-draw-loop"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent mb-2">
        Message Sent to Samuel Succesfully!
      </h2>
      <div className="text-gray-300 mb-6 text-center font-bold">
        <p>Thank you! The form has been submitted successfully.</p>
        <p className="text-center font-semibold"> </p>
        <p>I'll get back to you as soon as possible!</p>
      </div>

      <a
        href="/"
        onClick={() => setStatus(null)}
        className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent hover:underline hover:decoration-blue-500 cursor-pointer font-bold"
      >
        Go back
      </a>
    </div>
  </div>
)}


    </main>
  );
}
