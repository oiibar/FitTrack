const search = async (req, res) => {
    try {
        const { query } = req.query;

        res.status(200).json({
            success: true,
            message: `Query received: ${query}`,
        });
    } catch (error) {
        console.error('Error searching', error);
        res.status(500).json({
            success: false,
            error: "Failed to search."
        });
    }
};

export default {
    search,
};
