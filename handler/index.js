const handleLive = (data) => {
    // Extract useful information:
    // 1. fee: fee.original_price <- Original Price of Zhihu live
    // 2. score: review.score <- Number of stars
    // 3. participants: seats.taken <- Number of Participants
    // 4. id <- Zhihu live id
    // 5. starts_at (in unix format)
    // 6. subject <- Title of the Live
    let fee = 0;
    let score = 0;
    let participants = 0;

    if (data.fee) {
        fee = data.fee.original_price;
    }

    if (data.review) {
        score = data.review.score;
    }

    if (data.seats) {
        participants = data.seats.taken;
    }

    const { id, starts_at, subject } = data;

    return {
        fee,
        score,
        participants,
        id,
        starts_at,
        subject
    }
}

module.exports = handleLive;
