import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

export default function Result() {
  const [results, setResults] = useState([]);
  const [winAmount, setWinAmount] = useState(null);
  const [showLoser, setShowLoser] = useState(false);
  const [latestPeriod, setLatestPeriod] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const {
    BACKEND_URL,
    gameType,
    timer,
    showWinner,
    setShowWinner,
    setBalance,
    activeBets,
    setActiveBets,
  } = useContext(AppContext);

  const resultsPerPage = 10; // You can adjust this

  const fetchResults = async (page = 1, isInitialLoad = false) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/latest/result/${gameType}?page=${page}&limit=${resultsPerPage}`
      );

      if (isInitialLoad) {
        const latest = data.results[0];
        if (latest && latest.period !== latestPeriod) {

          if (activeBets && activeBets.length > 0) {
            let totalWinAmount = 0;
            let hasWon = false;
            let hasLost = false;

            // Check each bet against the result
            activeBets.forEach((bet) => {
              let winAmount = 0;
              let isWinningBet = false;

              // Handle color bets with special violet logic
              if (bet.selectedBetColour) {
                if (latest.colour === "violetRed") {
                  if (bet.selectedBetColour === "red") {
                    // Red bet wins with 1.5x payout on violetRed
                    winAmount = bet.betValue * 1.5;
                    isWinningBet = true;
                  } else if (bet.selectedBetColour === "violet") {
                    // Violet bet wins with 4x payout on violetRed
                    winAmount = bet.betValue * 4;
                    isWinningBet = true;
                  } else {
                    // Green bet (or any other) loses on violetRed
                    winAmount = 0;
                    isWinningBet = false;
                  }
                } else if (latest.colour === "violetGreen") {
                  if (bet.selectedBetColour === "green") {
                    // Green bet wins with 1.5x payout on violetGreen
                    winAmount = bet.betValue * 1.5;
                    isWinningBet = true;
                  } else if (bet.selectedBetColour === "violet") {
                    // Violet bet wins with 4x payout on violetGreen
                    winAmount = bet.betValue * 4;
                    isWinningBet = true;
                  } else {
                    // Red bet (or any other) loses on violetGreen
                    winAmount = 0;
                    isWinningBet = false;
                  }
                } else {
                  // Normal color matching (non-violet results)
                  if (bet.selectedBetColour === latest.colour) {
                    winAmount = bet.betValue * 2; // Normal payout
                    isWinningBet = true;
                  }
                }
              }

              // Handle size bets (unchanged logic)
              if (bet.selectedBetSize && bet.selectedBetSize === latest.size) {
                winAmount += bet.betValue * 2; // Add size bet winnings
                isWinningBet = true;
              }

               if((bet.selectedBetNumber!==undefined && bet.selectedBetNumber!==null)&& bet.selectedBetNumber===latest.number){
                winAmount+=bet.betValue*9
                isWinningBet = true
              }

              // Add to total if won
              if (isWinningBet && winAmount > 0) {
                totalWinAmount += winAmount;
                hasWon = true;
              } else if (!isWinningBet || winAmount === 0) {
                hasLost = true;
              }
            });

            // Update balance and show appropriate message
            if (hasWon) {
              setWinAmount(totalWinAmount);
              setBalance((prevBalance) => prevBalance + totalWinAmount);
              setShowWinner(true);
            } else if (hasLost && !hasWon) {
              // Only show loser if no bets won
              setShowLoser(true);
            }

            // Clear all active bets after processing
            setActiveBets([]);
          }

          setLatestPeriod(latest.period);
        }
      }

      setResults(data.results);
      setPagination(data.pagination);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (err) {
      console.log("Error fetching results:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      fetchResults(newPage);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages || 1;
    const current = currentPage;

    // Always show first page
    pages.push(1);

    // Add pages around current page
    let start = Math.max(2, current - 1);
    let end = Math.min(totalPages - 1, current + 1);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push("...");
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  useEffect(() => {
    fetchResults(1, true);
  }, [gameType]);

  useEffect(() => {
    if (timer <= 1 && !intervalRef.current) {
      intervalRef.current = setInterval(() => fetchResults(1, true), 800);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer]);

  return (
    <div className="result-container mb-6 px-2">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
          <i className="fa-solid fa-trophy text-white text-sm"></i>
        </div>
        <span className="text-gray-800 font-bold text-xl">Results History</span>
      </div>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full mb-5 shadow-sm"></div>

      {/* Results Box */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-3 py-4">
          <div
            className="grid gap-2 text-white text-sm font-semibold"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
          >
            <div className="text-center">Period</div>
            <div className="text-center">Size</div>
            <div className="text-center">Number</div>
            <div className="text-center">Color</div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-3"></div>
            <p className="text-lg font-medium">Loading results...</p>
          </div>
        )}

        {/* Results */}
        {!loading && (
          <div>
            {results.map((item, index) => (
              <div
                key={index}
                className={`grid gap-2 px-3 py-4 border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-teal-50 transition-colors duration-200`}
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
              >
                <div className="text-center flex justify-center">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-2 py-1.5 rounded-lg shadow-sm">
                    <span className="block truncate text-xs leading-tight">
                      {item.period}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <span
                    className={`text-xs font-bold px-2 py-1.5 rounded-full shadow-sm ${
                      item.size === "Big"
                        ? "bg-orange-200 text-orange-800"
                        : "bg-purple-200 text-purple-800"
                    }`}
                  >
                    {item.size}
                  </span>
                </div>

                <div className="text-center">
                  <div className="bg-gray-200 text-gray-800 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    {item.number}
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  {item.colour === "violetRed" ||
                  item.colour === "violetGreen" ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-6 h-6 rounded-full shadow-lg border-2 border-white bg-gradient-to-r from-purple-500 to-purple-600"></div>
                      <div
                        className={`w-6 h-6 rounded-full shadow-lg border-2 border-white ${
                          item.colour === "violetRed"
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                      ></div>
                    </div>
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full shadow-lg border-2 border-white ${
                        item.colour === "red"
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : "bg-gradient-to-r from-green-500 to-green-600"
                      }`}
                    ></div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty state */}
            {results.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-3">🎯</div>
                <p className="text-lg font-medium">No results available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile-Optimized Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Results info - Mobile optimized */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <div className="text-xs text-gray-600 text-center">
              Page {currentPage} of {pagination.totalPages} (
              {pagination.totalResults} total)
            </div>
          </div>

          {/* Mobile Pagination Controls */}
          <div className="p-3">
            {/* Previous/Next with Current Page */}
            <div className="flex items-center justify-between mb-5 px-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pagination.hasPrevPage
                    ? "bg-teal-500 text-white active:bg-teal-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <i className="fas fa-chevron-left text-xs"></i>
                <span>Previous</span>
              </button>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pagination.hasNextPage
                    ? "bg-teal-500 text-white active:bg-teal-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>Next</span>
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>

            {/* Quick Jump - Only show first few, current, and last few pages */}
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="w-8 h-8 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 active:bg-gray-200 transition-colors"
                  >
                    1
                  </button>
                  {currentPage > 4 && (
                    <span className="text-gray-400 text-xs px-1">...</span>
                  )}
                </>
              )}

              {/* Pages around current */}
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  if (pageNum < 1 || pageNum > pagination.totalPages)
                    return null;
                  if (currentPage > 3 && pageNum === 1) return null;
                  if (
                    currentPage < pagination.totalPages - 2 &&
                    pageNum === pagination.totalPages
                  )
                    return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        pageNum === currentPage
                          ? "bg-teal-500 text-white"
                          : "bg-gray-100 text-gray-700 active:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              {/* Last page */}
              {currentPage < pagination.totalPages - 2 &&
                pagination.totalPages > 5 && (
                  <>
                    {currentPage < pagination.totalPages - 3 && (
                      <span className="text-gray-400 text-xs px-1">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      className="w-8 h-8 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 active:bg-gray-200 transition-colors"
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Win popup */}
      {showWinner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 px-4">
          <div className="relative w-full max-w-sm bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 p-8 rounded-3xl shadow-2xl">
            <button
              className="absolute top-4 right-4 text-white text-2xl hover:scale-110 transition transform"
              onClick={() => setShowWinner(false)}
            >
              <i className="fa-regular fa-circle-xmark drop-shadow-lg"></i>
            </button>

            <div className="flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute w-full h-full rounded-full bg-yellow-300 blur-xl opacity-70"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                  <i className="fa-solid fa-trophy text-4xl text-yellow-700 drop-shadow-md"></i>
                </div>
              </div>

              <h2 className="text-3xl font-extrabold text-white mb-3 drop-shadow-lg">
                🎉 You Won! 🎉
              </h2>
              <p className="text-lg text-white font-medium mb-8 opacity-90">
                Congratulations!
              </p>

              <div className="bg-white text-green-600 text-4xl font-extrabold py-4 px-10 rounded-2xl shadow-xl border-2 border-green-400 mb-6">
                ₹{winAmount}
              </div>

              <p className="text-white font-semibold text-sm opacity-90 text-center">
                Amazing! Keep playing to win even more! 🚀
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lose popup */}
      {showLoser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setShowLoser(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center pt-4">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-2xl font-bold text-red-500 mb-3">
                Better Luck Next Time!
              </h2>
              <p className="text-gray-600 font-medium mb-6">
                Try again in the next round.
              </p>

              <button
                onClick={() => {
                  setShowLoser(false);
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
