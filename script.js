let pyodide;
let pyodideReady = false;

async function loadPyodideAndBlack() {
    console.log("⏳ Loading Pyodide...");

    try {
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
        });

        console.log("📦 Pyodide loaded, installing Black...");

        await pyodide.loadPackage("micropip");
        await pyodide.runPythonAsync(
            import micropip
            await micropip.install("black")
        );

        pyodideReady = true;
        console.log("✅ Pyodide and Black are ready!");
    } catch (error) {
        console.error("❌ Failed to load Pyodide or install Black:", error);
    }
}

loadPyodideAndBlack();


// --- Main Code Formatter Logic ---
document.addEventListener("DOMContentLoaded", () => {
    const codeTypeSelect = document.getElementById("codeType");
    const inputCodeTextarea = document.getElementById("inputCode");
    const outputCodeTextarea = document.getElementById("outputCode");
    const formatButton = document.getElementById("formatBtn");

    // Enable interaction
    codeTypeSelect.disabled = false;
    inputCodeTextarea.disabled = false;

    // Initialize line numbers on load
    updateLineNumbers('inputCode', 'lineNumbers');
    updateLineNumbers('outputCode', 'outputLineNumbers');

    // Update input line numbers on input
    inputCodeTextarea.addEventListener("input", () => {
        updateLineNumbers('inputCode', 'lineNumbers');
    });

    // Sync input scroll
    inputCodeTextarea.addEventListener("scroll", () => {
        syncScroll('inputCode', 'lineNumbers');
    });

    // Sync output scroll
    outputCodeTextarea.addEventListener("scroll", () => {
        syncScroll('outputCode', 'outputLineNumbers');
    });

    // Format button click
    formatButton.addEventListener("click", async () => {
        const codeType = codeTypeSelect.value;
        const inputCode = inputCodeTextarea.value;

        try {
            let formattedCode;

            if (codeType === "html") {
                formattedCode = prettier.format(inputCode, {
                    parser: "html",
                    plugins: prettierPlugins,
                });
            } else if (codeType === "css") {
                formattedCode = prettier.format(inputCode, {
                    parser: "css",
                    plugins: prettierPlugins,
                });
            } else if (codeType === "javascript") {
                formattedCode = prettier.format(inputCode, {
                    parser: "babel",
                    plugins: prettierPlugins,
                });
            } else if (codeType === "json") {
                formattedCode = prettier.format(inputCode, {
                    parser: "json",
                    plugins: prettierPlugins,
                });
            } else if (codeType === "python") {
                if (!pyodideReady) {
                    throw new Error("Pyodide is still loading. Please wait a moment.");
                }

                const code = 
import black
formatted = black.format_str(${JSON.stringify(inputCode)}, mode=black.Mode())
formatted
                ;
                const result = await pyodide.runPythonAsync(code);
                formattedCode = result;
            } else if (codeType === "java") {
                formattedCode = prettier.format(inputCode, {
                    parser: "java",
                    plugins: prettierPlugins,
                });
            }

            outputCodeTextarea.value = formattedCode;

            // Update output line numbers
            updateLineNumbers('outputCode', 'outputLineNumbers');

        } catch (error) {
            outputCodeTextarea.value = "Error formatting code: " + error.message;
            updateLineNumbers('outputCode', 'outputLineNumbers');
        }
    });
});

// --- Line Number Functions (unchanged) ---
function updateLineNumbers(textareaId, lineNumbersId) {
    const textarea = document.getElementById(textareaId);
    const lineNumbers = document.getElementById(lineNumbersId);
    const numberOfLines = textarea.value.split('\n').length;
    lineNumbers.innerHTML = '';
    for (let i = 1; i <= numberOfLines; i++) {
        lineNumbers.innerHTML += i + '<br>';
    }
}

function syncScroll(textareaId, lineNumbersId) {
    const textarea = document.getElementById(textareaId);
    const lineNumbers = document.getElementById(lineNumbersId);
    lineNumbers.scrollTop = textarea.scrollTop;
}
