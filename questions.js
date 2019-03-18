


exports.keys = {
    project_name = "project_name",
    past_milestones = "past_milestones",
    past_milestones_yes = "yes_answer",
    past_milestones_no = "no_answer",
    issues = "issues",
    lessons = "lessons",
    future_milestones = "future_milestones"
}

exports.question = {
    // part one
    project_name: "What is your project name?",
    past_milestones: {
        // covers the question
        content: "Have you reviewed your past milestones?",
        // covers the follow up question for yes and no case
        yes_answer: {
            one: "Please review level one milestone and tasks",
            two: "Please review level two milestone and tasks",
            three: "Please review level three milestone and tasks"
        },
        no_answer: {
            one: "Describe level one of key activities done within the past 15 days",
            two: "Describe level two of key activities done within the past 15 days",
            three: "Describe level three of key activities done within the past 15 days"
        }
    },
    issues: {
        // covers the question
        content: {
            scheduling: "What scheduling issues did you face that impacted your milestones or term goals?",
            resources: "What resources issues did you face that impacted your milestones or term goals?",
            time_management: "What time management issues did you face that impacted your milestones or term goals?",
            communication: "What communication issues did you face that impacted your milestones or term goals?"
        }
    },
    lessons: {
        content: "What lessons did you learn from these past issues or challenges?"
    },
    future_milestones: {
        content: {
            one: "What level one milestones do you have planned for the rest of the term?",
            two: "What level two milestones do you have planned for the month ahead?",
            three: "What level three milestones do you have planned for the next 15 days?"
        }
    }
    // part two
}
