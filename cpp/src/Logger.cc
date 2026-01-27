/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#include "utils/Logger.hh"

#include <chrono>
#include <ctime>
#include <iomanip>
#include <iostream>
#include <mutex>
#include <cstring>
#include <sstream>
#if defined(_WIN32)
#include <io.h>
#include <cstdio>
#else
#include <unistd.h>
#endif

namespace utils {

static LogLevel getDefaultLogLevel() {
#if defined(_WIN32)
  return (_isatty(_fileno(stdout)) ? LogLevel::DEBUG : LogLevel::INFO);
#else
  return (isatty(fileno(stdout)) ? LogLevel::DEBUG : LogLevel::INFO);
#endif
}

static LogLevel g_level = getDefaultLogLevel();
static std::mutex g_mutex;

void Logger::setLevel(LogLevel level) {
  std::lock_guard<std::mutex> lk(g_mutex);
  g_level = level;
}

static const char* levelToString(LogLevel l) {
  switch (l) {
    case LogLevel::DEBUG: return "DEBUG";
    case LogLevel::INFO: return "INFO";
    case LogLevel::WARN: return "WARN";
    case LogLevel::ERROR: return "ERROR";
  }
  return "UNKNOWN";
}

static const char* levelColor(LogLevel l) {
  switch (l) {
    case LogLevel::DEBUG: return "\x1b[36m"; // cyan
    case LogLevel::INFO:  return "\x1b[32m"; // green
    case LogLevel::WARN:  return "\x1b[33m"; // yellow
    case LogLevel::ERROR: return "\x1b[31m"; // red
  }
  return "\x1b[0m";
}

void Logger::log(LogLevel level, const std::string& msg) {
  std::lock_guard<std::mutex> lk(g_mutex);
  if (level < g_level) return;

  // timestamp
  auto now = std::chrono::system_clock::now();
  auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()) % 1000;
  std::time_t t = std::chrono::system_clock::to_time_t(now);
  std::tm tm{};
#if defined(_WIN32)
  localtime_s(&tm, &t);
#else
  localtime_r(&t, &tm);
#endif

  std::ostringstream oss;
  oss << std::put_time(&tm, "%Y-%m-%d %H:%M:%S") << '.' << std::setfill('0') << std::setw(3) << ms.count();

  const char* color = levelColor(level);
  const char* reset = "\x1b[0m";

  std::cout << color << "[" << levelToString(level) << "] " << reset;
  std::cout << "(" << oss.str() << ") " << msg << std::endl;
}

void Logger::log(LogLevel level, const std::string& msg, const char* file, int line) {
  std::lock_guard<std::mutex> lk(g_mutex);
  if (level < g_level) return;

  // timestamp
  auto now = std::chrono::system_clock::now();
  auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()) % 1000;
  std::time_t t = std::chrono::system_clock::to_time_t(now);
  std::tm tm{};
#if defined(_WIN32)
  localtime_s(&tm, &t);
#else
  localtime_r(&t, &tm);
#endif

  std::ostringstream oss;
  oss << std::put_time(&tm, "%Y-%m-%d %H:%M:%S") << '.' << std::setfill('0') << std::setw(3) << ms.count();

  const char* color = levelColor(level);
  const char* reset = "\x1b[0m";

  // extract filename from path
  const char* fname = file;
  const char* p1 = strrchr(file, '/');
  const char* p2 = strrchr(file, '\\');
  if (p1 || p2) {
    const char* p = p1 > p2 ? p1 : p2;
    fname = p + 1;
  }

  std::cout << color << "[" << levelToString(level) << "] " << reset;
  std::cout << "(" << oss.str() << ") ";
  std::cout << fname << ":" << line << " " << msg << std::endl;
}

} // namespace utils
