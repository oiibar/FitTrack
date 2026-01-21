const items = async (req, res) => {
    try {
        const { id } = req.params;

        res.status(200).json({
            success: true,
            message: `ID received: ${id}`,
        });
    } catch (error) {
        console.error('Error finding', error);
        res.status(500).json({
            success: false,
            error: "Failed to find."
        });
    }
};

export default {
    items,
};
