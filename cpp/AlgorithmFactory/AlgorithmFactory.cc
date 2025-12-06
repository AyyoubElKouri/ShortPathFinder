/*--------------------------------------------------------------------------------------------------
*                       Copyright (c) Ayyoub EL Kouri. All rights reserved
*     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
*-------------------------------------------------------------------------------------------------*/

#include "AlgorithmFactory.hh"

std::unordered_map<AlgorithmType, AlgorithmFactory::Creator>& AlgorithmFactory::getMap() {
    static std::unordered_map<AlgorithmType, Creator> map;
    return map;
}

void AlgorithmFactory::registerAlgorithm(AlgorithmType type, Creator creator) {
    getMap()[type] = std::move(creator);
}

std::unique_ptr<Algorithm> AlgorithmFactory::create(AlgorithmType type) {
   auto& map = getMap();
   auto it = map.find(type);
   if (it == map.end()) {
      throw std::runtime_error("Algorithm not registered");
   }
   return it->second();
}
