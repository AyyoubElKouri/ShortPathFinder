/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#pragma once

#include <string>

namespace utils {

enum class LogLevel { DEBUG = 0, INFO, WARN, ERROR };

class Logger {
public:
  // Configure global log level (messages below this level are dropped)
  static void setLevel(LogLevel level);

  // Log a message at the given level
  static void log(LogLevel level, const std::string& msg);

  // Log with source location (file, line)
  static void log(LogLevel level, const std::string& msg, const char* file, int line);

  // Convenience helpers
  static void debug(const std::string& msg) { log(LogLevel::DEBUG, msg); }
  static void info(const std::string& msg) { log(LogLevel::INFO, msg); }
  static void warn(const std::string& msg) { log(LogLevel::WARN, msg); }
  static void error(const std::string& msg) { log(LogLevel::ERROR, msg); }
};

// Formatting macros for convenience
#define LOG_DEBUG(msg) ::utils::Logger::log(::utils::LogLevel::DEBUG, (msg), __FILE__, __LINE__)
#define LOG_INFO(msg)  ::utils::Logger::log(::utils::LogLevel::INFO,  (msg), __FILE__, __LINE__)
#define LOG_WARN(msg)  ::utils::Logger::log(::utils::LogLevel::WARN,  (msg), __FILE__, __LINE__)
#define LOG_ERROR(msg) ::utils::Logger::log(::utils::LogLevel::ERROR, (msg), __FILE__, __LINE__)

} // namespace utils
