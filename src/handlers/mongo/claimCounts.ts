// Counts all teh Pending, Approved, NotApproved claims by projects

export const claimCountQuery = 
  [
    {$group: {
      _id: '$projectTx', 
      pending: {
          $sum: {
            $cond : {
              if: {
                $eq: ['$latestEvaluation', 'Pending']
              }, 
              then: 1,
              else: 0
            }
          }
        },
      approved: {
          $sum: {
            $cond : {
              if: {
                $eq: ['$latestEvaluation', 'Approved']
              }, 
              then: 1,
              else: 0
            }
          }
        },

      notApproved: {
          $sum: {
            $cond : {
              if: {
                $eq: ['$latestEvaluation', 'NotApproved']
              }, 
              then: 1,
              else: 0
            }
          }
        }
      }
    }

  ];