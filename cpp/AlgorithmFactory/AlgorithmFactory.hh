/*--------------------------------------------------------------------------------------------------
*                       Copyright (c) Ayyoub EL Kouri. All rights reserved
*     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
*-------------------------------------------------------------------------------------------------*/

#ifndef ALGORITHM_FACTORY_HH
#define ALGORITHM_FACTORY_HH

#include <functional>
#include <memory>
#include <unordered_map>
#include <stdexcept>

#include "Enums/Enums.hh"
#include "Algorithms/Algorithm.hh"

class AlgorithmFactory {
public:
   using Creator = std::function<std::unique_ptr<Algorithm>()>;

   static void registerAlgorithm(AlgorithmType type, Creator creator);
   static std::unique_ptr<Algorithm> create(AlgorithmType type);

private:
   static std::unordered_map<AlgorithmType, Creator>& getMap();
};

#endif // ALGORITHM_FACTORY_HH