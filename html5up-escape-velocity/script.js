const btn = document.getElementById("generateBtn");

btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const lessonText = document
        .getElementById("lessonInput")
        .value
        .trim();

    if (!lessonText) {
        alert("Please enter lesson content first.");
        return;
    }

    document.getElementById("flashcardsOutput").innerHTML =
        "<p>Generating...</p>";

    document.getElementById("conceptsOutput").innerHTML =
        "<p>Generating...</p>";

    document.getElementById("revisionOutput").innerHTML =
        "<p>Generating...</p>";

    try {

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                    "Authorization":
                        "Bearer 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"
                },

                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",

                    messages: [
                        {
                            role: "user",
                            content: `
Generate:

1. 5 Flashcards
2. 5 Key Concepts
3. Revision Notes

Return ONLY JSON.

Format:

{
  "flashcards":[
    {
      "question":"",
      "answer":""
    }
  ],
  "keyConcepts":[
    {
      "term":"",
      "definition":""
    }
  ],
  "revisionNotes":[
    ""
  ]
}

Lesson:

${lessonText}
`
                        }
                    ],

                    temperature: 0.7
                })
            }
        );

        const data = await response.json();

        let content =
    data.choices[0].message.content;

content = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

const result = JSON.parse(content);

        displayResults(result);
        document.getElementById("main")
.scrollIntoView({
    behavior: "smooth"
});

    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong. Check console."
        );
    }
});

function displayResults(result) {

    document.getElementById(
        "flashcardsOutput"
    ).innerHTML =
        result.flashcards
            .map(
                card => `
                <div class="flashcard">
                    <strong>Q:</strong>
                    ${card.question}
                    <br><br>
                    <strong>A:</strong>
                    ${card.answer}
                </div>
            `
            )
            .join("");

    document.getElementById(
        "conceptsOutput"
    ).innerHTML =
        result.keyConcepts
            .map(
                concept => `
                <div class="concept-card">
                    <strong>
                        ${concept.term}
                    </strong>
                    <br><br>
                    ${concept.definition}
                </div>
            `
            )
            .join("");

    document.getElementById(
        "revisionOutput"
    ).innerHTML =
        `
        <div class="revision-card">
<ul>
        ${
            result.revisionNotes
                .map(
                    note =>
                    `<li>${note}</li>`
                )
                .join("")
        }
        </ul>
        </div>
        `;
}