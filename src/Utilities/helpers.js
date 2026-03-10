import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const verifyEmail = (email, message = true) => {
  if (email.trim() == "" && !email) {
    toast.error(`Email should not be empty`, {
      toastId: "empty-email-verification-error",
    });
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);
  if (!isValidEmail) {
    toast.error(`"${email}" is an invalid email address`, {
      toastId: "email-verification-error",
    });
    return false;
  }
  return isValidEmail;
};

export const verifyPassword = (password, message = true) => {
  if (!password || password.trim() === "") {
    if (message) {
      toast.error("Password should not be empty", {
        toastId: "empty-password-verification-error",
      });
    }
    return false;
  }

  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const isValidPassword = passwordRegex.test(password);

  if (!isValidPassword) {
    toast.error(
      "Password must be at least 8 characters long and contain at least one letter and one number",
      { toastId: "password-verification-error" }
    );
  }

  return isValidPassword;
};

export const comparePasswords = (a, b, message = true) => {
  if (a != b) {
    if (message) {
      toast.error(`Password mismatch`, {
        toastId: "password-verification-error",
      });
    }
    return false;
  }
  return true;
};

export const isRequired = (val, field = "", message = true) => {
  if (val && val.trim() != "") {
    return true;
  }
  if (message) {
    toast.error(`"${field}" should not be empty`, {
      toastId: "empty-field-verification-error",
    });
  }
  return false;
};

export const imageValidator = (file) => {
  if (file && file.size <= 209715200) {
    if (
      file.type == "image/png" ||
      file.type == "image/jpg" ||
      file.type == "image/jpeg" ||
      file.type == "image/webp" ||
      file.type == "image/gif" ||
      file.type == "image/svg+xml" ||
      file.type == "image/svg" ||
      file.type == "application/pdf"
    ) {
      return true;
    } else {
      toast.error("File not supported", {
        toastId: "upload-error-1",
      });
      return false;
    }
  } else {
    toast.error("File size too large", {
      toastId: "upload-error-1",
    });
    return false;
  }
};

export const createObjectURL = (file) => {
  return URL.createObjectURL(file);
};



export const getInitials = (name) => {
  if (!name) return "N/A";
  const names = name.split(" ");
  const initials = names
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
  return initials;
};

export const formatDate = (dateString) => {
  if (!dateString) {
    return "N/A"; 
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return `${day}-${monthNames[monthIndex]}-${year}`;
};
 
export const formatTime = (createdAt) => {
  if (!createdAt) {
    return "N/A"; 
  }

  const date = new Date(createdAt);
  if (isNaN(date.getTime())) {
    return "Invalid Time"; 
  }

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  
  return `${hours}:${minutes}`;
};
 

export function convertTo12Hour(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12; 

  return `${hour}:${minute} ${ampm}`;
}

//format duration
export const formatDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = parseInt((match[1] || "0H").slice(0, -1));
  const minutes = parseInt((match[2] || "0M").slice(0, -1));
  const seconds = parseInt((match[3] || "0S").slice(0, -1));

  let result = "";

  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}m `;
  }
  result += `${seconds}s`;

  return result.trim();
};

export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const generatePassword = () => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*-?.";

  // Ensure at least one of each required type
  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest of the password with random characters
  const allCharacters = uppercase + lowercase + numbers + symbols;
  for (let i = password.length; i < 12; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the password to ensure randomness
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
};


export const downloadCSV = (columns, data, defaultFileName = "export.csv") => {
  if (typeof window === "undefined") return; 

  if (!columns || !data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  setTimeout(() => {
    const fileName = window.prompt("Enter file name for the CSV", defaultFileName);
    if (!fileName) return;

    const headers = columns.map((col) => col.header).join(",");

    const csvData = data.map((row) =>
      columns
        .map((col) => {
          const cellData = row[col.key] ?? "";
          return typeof cellData === "string" ? `"${cellData.replace(/"/g, '""')}"` : cellData;
        })
        .join(",")
    );

    const csvString = [headers, ...csvData].join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 0);
};

// Convert text to camelCase display format
export const toCamelCaseDisplay = (text) => {
  if (!text) return "";
  
  // Handle snake_case, kebab-case, and camelCase
  return text
    .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

// Convert object keys to camelCase display format
export const formatObjectKeysForDisplay = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const formatted = {};
  Object.keys(obj).forEach(key => {
    formatted[key] = {
      ...obj[key],
      displayKey: toCamelCaseDisplay(key)
    };
  });
  
  return formatted;
};

