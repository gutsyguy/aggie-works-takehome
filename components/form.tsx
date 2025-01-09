import React, { ChangeEvent, useState } from "react";
import "aos/dist/aos.css";

const ContactForm = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [subject, setSubject] = useState<string>("");

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubjectChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  return (
    <div
      className="flex justify-center items-center h-screen text-white"
      data-te-animation-init
      data-te-animation-start="onScroll"
      data-te-animation-on-scroll="repeat"
      data-te-animation-show-on-load="false"
      data-te-animation="[slide-right_1s_ease-in-out]"
      data-aos="zoom-out"
    >
      <form className="w-full max-w-[90%] mx-auto bg-red-400 rounded-xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Me</h1>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 text-base text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={handleNameChange}
            required
            placeholder="Enter name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 text-base text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="Enter email"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            className="w-full px-4 py-2 text-base text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={subject}
            onChange={handleSubjectChange}
            required
            placeholder="Enter subject"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block mb-2">
            Message
          </label>
          <textarea
            id="message"
            className="w-full px-4 py-4 text-base text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
            minLength={10}
            maxLength={150}
            value={message}
            onChange={handleMessageChange}
            placeholder="Your message here..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 px-4 py-3 rounded-md shadow-sm transition duration-300 ease-in-out hover:-translate-y-0.5 transform"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
