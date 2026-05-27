import { useContext, useEffect, useRef, useState } from "react";
import { GameContext, WalletContext, BACKEND_URL } from "../context/AppContext";
import axios from "axios";

export default function Result() {
  const [results, setResults] = useState([]);
  const [winAmount, setWinAmount] = useState(null);
  const [showLoser, setShowLoser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    gameType,
    showWinner,
    setShowWinner,
    activeBets,
    setActiveBets,
    onWSMessage,
  } = useContext(GameContext);
  const { setBalance } = useContext(WalletContext);

  const resultsPerPage = 40;

  const activeBetsRef = useRef(activeBets);
  activeBetsRef.current = activeBets;
  const processedPeriodsRef = useRef(new Set());

  function processResult(msg, bets) {
    if (!bets || bets.length === 0) return;
    if (processedPeriodsRef.current.has(msg.period)) return;
    processedPeriodsRef.current.add(msg.period);

    let totalWinAmount = 0;
    let hasWon = false;
    let hasLost = false;

    bets.forEach((bet) => {
      if (String(bet.period) !== String(msg.period)) return;

      let winAmount = 0;
      let isWinningBet = false;

      if (bet.selectedBetColour) {
        if (msg.colour === "violetRed") {
          if (bet.selectedBetColour === "red") {
            winAmount = bet.betValue * 1.5;
            isWinningBet = true;
          } else if (bet.selectedBetColour === "violet") {
            winAmount = bet.betValue * 4;
            isWinningBet = true;
          }
        } else if (msg.colour === "violetGreen") {
          if (bet.selectedBetColour === "green") {
            winAmount = bet.betValue * 1.5;
            isWinningBet = true;
          } else if (bet.selectedBetColour === "violet") {
            winAmount = bet.betValue * 4;
            isWinningBet = true;
          }
        } else {
          if (bet.selectedBetColour === msg.colour) {
            winAmount = bet.betValue * 2;
            isWinningBet = true;
          }
        }
      }

      if (bet.selectedBetSize && bet.selectedBetSize === msg.size) {
        winAmount += bet.betValue * 2;
        isWinningBet = true;
      }

      if ((bet.selectedBetNumber !== undefined && bet.selectedBetNumber !== null) && bet.selectedBetNumber === msg.number) {
        winAmount += bet.betValue * 9;
        isWinningBet = true;
      }

      if (isWinningBet && winAmount > 0) {
        totalWinAmount += winAmount;
        hasWon = true;
      } else if (!isWinningBet || winAmount === 0) {
        hasLost = true;
      }
    });

    if (hasWon) {
      setWinAmount(totalWinAmount);
      setBalance((prevBalance) => prevBalance + totalWinAmount);
      setShowWinner(true);
    } else if (hasLost && !hasWon) {
      setShowLoser(true);
    }

    if (hasWon || hasLost) {
      setActiveBets([]);
    }

    fetchResults(1, true);
  }

  const fetchResults = async (page = 1, isInitialLoad = false) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/latest/result/${gameType}?page=${page}&limit=${resultsPerPage}`
      );

      if (isInitialLoad) {
        setResults(data.results);
      } else {
        setResults(data.results);
      }

      setPagination(data.pagination);
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

  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages || 1;
    const current = currentPage;

    pages.push(1);

    let start = Math.max(2, current - 1);
    let end = Math.min(totalPages - 1, current + 1);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  useEffect(() => {
    fetchResults(1, true);
  }, [gameType]);

  useEffect(() => {
    const unsub = onWSMessage((msg) => {
      if (msg.type === 'game:result' && msg.gameType === gameType) {
        processResult(msg, activeBetsRef.current);
      }
    });

    return unsub;
  }, [gameType, onWSMessage]);

  // Polling fallback — shows win/loss popup if WebSocket missed the result
  useEffect(() => {
    if (!gameType) return;

    const id = setInterval(async () => {
      const currentBets = activeBetsRef.current;
      if (!currentBets || currentBets.length === 0) return;

      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/latest/result/${gameType}?page=1&limit=1`
        );
        if (data.success && data.results && data.results.length > 0) {
          const latest = data.results[0];
          processResult(latest, currentBets);
        }
      } catch (e) {}
    }, 3000);

    return () => clearInterval(id);
  }, [gameType]);

  return (
    <div className="result-container mb-6 px-2">
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
          <i className="fa-solid fa-trophy text-white text-sm"></i>
        </div>
        <span className="text-gray-800 font-bold text-xl">Results History</span>
      </div>

      <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full mb-5 shadow-sm"></div>

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

        {loading && (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-3"></div>
            <p className="text-lg font-medium">Loading results...</p>
          </div>
        )}

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

            {results.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-3">🎯</div>
                <p className="text-lg font-medium">No results available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <div className="text-xs text-gray-600 text-center">
              Page {currentPage} of {pagination.totalPages} (
              {pagination.totalResults} total)
            </div>
          </div>

          <div className="p-3">
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

            <div className="flex items-center justify-center gap-1 flex-wrap">
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
