// Some sample data to test loading in data and showing it.
module.exports = [
    {
        id: 1,
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
    },
    {
        id: 2,
        name: 'Peter',
        personId: 19082,
        circles: [
            {
                id: 10945,
                name: 'Marcom',
            },
        ],
        roles: [
            {
                id: 7976700,
                name: 'Data Analyst',
                purpose: 'Analyzing data useful for marcom',
                accountabilities: [
                    {
                        id: 8504388,
                        description: 'Tracking Google analytics for the VoIPGRID site',
                    },
                    {
                        id: 8504389,
                        description: 'Gathering data about partner behaviour on the platform',
                    },
                ],
            },
        ],
    },
];
