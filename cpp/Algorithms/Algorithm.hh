/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

#ifndef ALGORITHM_HH
#define ALGORITHM_HH

#include "InputResult/InputResult.hh"

class Algorithm {
public:
   virtual ~Algorithm() = default;
   virtual PathfindingResult execute(const PathfindingInput& input) = 0;
};


#endif 