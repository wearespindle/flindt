// Some sample data to test loading in data and showing it.
const feedbackReceived = [
    {
        id: 1,
        date: '12 aug. 2016',
        name: 'Jan Arend',
        personId: 17506,
        circles: [
            {
                id: 3943,
                name: 'Sales and Support',
            },
        ],
        roles: [
            {
                id: 65528,
                name: 'Content Manager Wiki',
                purpose: 'Maintaining content VoIPGRID Wiki',
                accountabilities: [
                    {
                        id: 263356,
                        description: 'Creating and maintaining the technical content of the VoIPGRID wiki',
                    },
                ],
            },
        ],
        roleFeedback: {
            positive: [
                {
                    content: 'Het gaat goed',
                },
                {
                    content: 'Prima bezig',
                },
            ],
            improvements: [
                {
                    content: 'Iets later beginnen, scheelt koffie!',
                },
            ],
        },
        personFeedback: {
            question: 'Welke auto zou Tom zijn?',
            answer: 'Mercedes, die zijn super mooi!',
        },
    },
];

export default feedbackReceived;
