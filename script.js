
    /* =========================================================
       TRUSTED NEWS / GOVERNMENT DOMAINS
    ========================================================= */

    const TRUSTED_DOMAINS = [

        "reuters.com",
        "apnews.com",
        "bbc.com",
        "bbc.co.uk",
        "nytimes.com",
        "bloomberg.com",
        "npr.org",
        "wsj.com",

        /* Indian official sources */

        "rbi.org.in",
        "isro.gov.in",
        "pib.gov.in",
        "india.gov.in",
        "eci.gov.in",
        "supremecourtofindia.nic.in",
        "drdo.gov.in",
        "nic.in"

    ];


    /* =========================================================
       KNOWN UNRELIABLE / TEST DOMAINS
    ========================================================= */

    const UNRELIABLE_DOMAINS = [

        "infowars.com",
        "naturalnews.com",
        "worldnewsdailyreport.com",
        "dailybuzzlive.com",
        "newslo.com",
        "freedomweekly.com",

        /* Obviously suspicious test domains */

        "fake-news.example",
        "fake-news.example.com",
        "freegovernmentbenefit.example.com",
        "rbi-freecash.example.com",

        ".xyz",
        ".click",
        ".top"

    ];


    /* =========================================================
       CLICKBAIT PHRASES
    ========================================================= */

    const CLICKBAIT_TRIGGERS = [

        "you won't believe",
        "you will not believe",
        "shocking secret",
        "what happened next",
        "will blow your mind",
        "scientists hate this",
        "miracle cure",
        "absolute proof",
        "hidden truth exposed",
        "share this now",
        "share before it is deleted",
        "government doesn't want you to know",
        "they don't want you to know",
        "must see",
        "breaking shocking news",
        "100% guaranteed",
        "guaranteed money",
        "free money",
        "claim now",
        "act now"

    ];


    /* =========================================================
       SENSATIONAL WORDS
    ========================================================= */

    const HYPERBOLE_WORDS = [

        "shocking",
        "unbelievable",
        "outrageous",
        "disastrous",
        "miraculous",
        "scandalous",
        "furious",
        "terrifying",
        "collapse",
        "urgent",
        "explosive",
        "secret",
        "incredible",
        "massive",
        "dangerous",
        "exposed",
        "viral",
        "guaranteed",
        "historic"

    ];


    /* =========================================================
       SUSPICIOUS CLAIMS
    ========================================================= */

    const SUSPICIOUS_CLAIMS = [

        "free money",
        "free cash",
        "win money",
        "guaranteed income",
        "guaranteed profit",
        "double your money",
        "click this link",
        "send your bank details",
        "enter your aadhaar",
        "enter your password",
        "claim your reward",
        "limited time offer",
        "secret government scheme",
        "government is giving",
        "everyone will receive",
        "every citizen will receive"

    ];


    /* =========================================================
       CHARACTER COUNT
    ========================================================= */

    function updateWordCount() {

        const text =
            document.getElementById("newsText").value;

        document.getElementById("charCount").innerText =
            `${text.length} characters`;

    }


    /* =========================================================
       CLEAN DOMAIN
    ========================================================= */

    function cleanDomain(source) {

        source = source
            .toLowerCase()
            .trim();

        source = source
            .replace("https://", "")
            .replace("http://", "")
            .replace("www.", "");

        source = source.split("/")[0];

        return source;

    }


    /* =========================================================
       CHECK DOMAIN
    ========================================================= */

    function checkDomain(source) {

        const domain = cleanDomain(source);

        if (!domain) {

            return {
                score: 0,
                status: "No Domain",
                className: "yellow"
            };

        }


        const trusted =
            TRUSTED_DOMAINS.some(
                item => domain === item ||
                        domain.endsWith("." + item)
            );


        if (trusted) {

            return {
                score: 90,
                status: "Trusted",
                className: "green"
            };

        }


        const unreliable =
            UNRELIABLE_DOMAINS.some(
                item => domain.includes(item)
            );


        if (unreliable) {

            return {
                score: 10,
                status: "Untrusted",
                className: "red"
            };

        }


        return {

            score: 50,
            status: "Unknown",
            className: "yellow"

        };

    }


    /* =========================================================
       MAIN ANALYSIS
    ========================================================= */

    function analyzeArticle() {

        const text =
            document.getElementById("newsText")
            .value.trim();

        const source =
            document.getElementById("newsSource")
            .value.trim();


        if (text.length < 50) {

            alert(
                "Please enter at least 50 characters of article text."
            );

            return;

        }


        /* -----------------------------------------------
           DOMAIN ANALYSIS
        ------------------------------------------------ */

        const domainResult =
            checkDomain(source);


        /* -----------------------------------------------
           TEXT NORMALIZATION
        ------------------------------------------------ */

        const lowerText =
            text.toLowerCase();


        const words =
            lowerText.split(/\s+/);


        /* -----------------------------------------------
           CLICKBAIT
        ------------------------------------------------ */

        let clickbaitHits = 0;


        CLICKBAIT_TRIGGERS.forEach(
            phrase => {

                if (lowerText.includes(phrase)) {

                    clickbaitHits++;

                }

            }
        );


        const clickbaitScore =
            Math.min(
                100,
                clickbaitHits * 20
            );


        /* -----------------------------------------------
           SENSATIONALISM
        ------------------------------------------------ */

        let hyperboleHits = 0;


        words.forEach(word => {

            const cleanWord =
                word.replace(
                    /[^a-z]/g,
                    ""
                );


            if (
                HYPERBOLE_WORDS
                .includes(cleanWord)
            ) {

                hyperboleHits++;

            }

        });


        const sensationalScore =
            Math.min(
                100,
                Math.round(
                    (hyperboleHits /
                    Math.max(words.length, 1))
                    * 500
                )
            );


        /* -----------------------------------------------
           SUSPICIOUS CLAIMS
        ------------------------------------------------ */

        let suspiciousHits = 0;


        SUSPICIOUS_CLAIMS.forEach(
            phrase => {

                if (
                    lowerText.includes(phrase)
                ) {

                    suspiciousHits++;

                }

            }
        );


        /* -----------------------------------------------
           CAPITALIZATION
        ------------------------------------------------ */

        const upperCount =
            (text.match(/[A-Z]/g) || []).length;


        const lowerCount =
            (text.match(/[a-z]/g) || []).length;


        const capsRatio =
            upperCount /
            Math.max(
                upperCount + lowerCount,
                1
            );


        let capitalizationPenalty = 0;


        if (capsRatio > 0.16) {

            capitalizationPenalty = 10;

        }


        /* -----------------------------------------------
           SUSPICIOUS URL / PERSONAL DATA
        ------------------------------------------------ */

        let dangerousLinkPenalty = 0;


        if (
            lowerText.includes("http://") ||
            lowerText.includes("https://") ||
            lowerText.includes("bit.ly") ||
            lowerText.includes("tinyurl")
        ) {

            dangerousLinkPenalty += 10;

        }


        if (
            lowerText.includes("bank details") ||
            lowerText.includes("password") ||
            lowerText.includes("otp") ||
            lowerText.includes("aadhaar number")
        ) {

            dangerousLinkPenalty += 15;

        }


        /* -----------------------------------------------
           CALCULATE FINAL SCORE
        ------------------------------------------------ */

        let score;


        /*
           Domain has the strongest influence,
           but text characteristics also matter.
        */


        if (domainResult.status === "Trusted") {

            score =
                75
                - clickbaitScore * 0.15
                - sensationalScore * 0.15
                - suspiciousHits * 5
                - capitalizationPenalty
                - dangerousLinkPenalty;

        }

        else if (
            domainResult.status === "Untrusted"
        ) {

            score =
                30
                - clickbaitScore * 0.20
                - sensationalScore * 0.20
                - suspiciousHits * 6
                - capitalizationPenalty
                - dangerousLinkPenalty;

        }

        else {

            score =
                50
                - clickbaitScore * 0.20
                - sensationalScore * 0.20
                - suspiciousHits * 5
                - capitalizationPenalty
                - dangerousLinkPenalty;

        }


        score =
            Math.round(
                Math.max(
                    0,
                    Math.min(100, score)
                )
            );


        /* -----------------------------------------------
           VERDICT
        ------------------------------------------------ */

        let verdict;
        let themeColor;


        if (score >= 70) {

            verdict =
                "✅ High Credibility";

            themeColor =
                "var(--safe)";

        }

        else if (score >= 45) {

            verdict =
                "⚠️ Questionable";

            themeColor =
                "var(--warning)";

        }

        else {

            verdict =
                "🚨 High Risk / Likely Fake";

            themeColor =
                "var(--danger)";

        }


        /* -----------------------------------------------
           EXPLANATION
        ------------------------------------------------ */

        let explanation = "";


        if (
            domainResult.status === "Trusted"
        ) {

            explanation +=
                "The publisher domain is recognized as a trusted source. ";

        }

        else if (
            domainResult.status === "Untrusted"
        ) {

            explanation +=
                "The publisher domain is flagged as an untrusted or suspicious source. ";

        }

        else {

            explanation +=
                "The publisher domain is not in the trusted-source registry, so its credibility cannot be confirmed. ";

        }


        if (clickbaitHits > 0) {

            explanation +=
                `The article contains ${clickbaitHits} clickbait phrase(s). `;

        }


        if (hyperboleHits > 0) {

            explanation +=
                `It contains ${hyperboleHits} sensational word(s). `;

        }


        if (suspiciousHits > 0) {

            explanation +=
                `It contains ${suspiciousHits} suspicious claim pattern(s). `;

        }


        if (dangerousLinkPenalty > 0) {

            explanation +=
                "The article contains potentially risky links or requests for sensitive information. ";

        }


        if (
            clickbaitHits === 0 &&
            hyperboleHits === 0 &&
            suspiciousHits === 0
        ) {

            explanation +=
                "No major clickbait or suspicious language patterns were detected.";

        }


        /* -----------------------------------------------
           DISPLAY RESULTS
        ------------------------------------------------ */

        const resultsCard =
            document.getElementById(
                "resultsCard"
            );


        const meterFill =
            document.getElementById(
                "meterFill"
            );


        const scoreText =
            document.getElementById(
                "scoreText"
            );


        const verdictBadge =
            document.getElementById(
                "verdictBadge"
            );


        resultsCard.style.display =
            "block";


        meterFill.style.backgroundColor =
            themeColor;


        meterFill.style.width =
            score + "%";


        scoreText.innerText =
            score + "%";


        verdictBadge.style.backgroundColor =
            themeColor;


        verdictBadge.innerText =
            verdict;


        /* -----------------------------------------------
           DOMAIN METRIC
        ------------------------------------------------ */

        const domainMetric =
            document.getElementById(
                "domainMetric"
            );


        domainMetric.innerText =
            domainResult.score + "%";


        domainMetric.className =
            domainResult.className;


        /* -----------------------------------------------
           OTHER METRICS
        ------------------------------------------------ */

        document.getElementById(
            "clickbaitMetric"
        ).innerText =
            clickbaitScore + "%";


        document.getElementById(
            "sensationalMetric"
        ).innerText =
            sensationalScore + "%";


        document.getElementById(
            "sourceMetric"
        ).innerText =
            domainResult.status;


        document.getElementById(
            "sourceMetric"
        ).className =
            domainResult.className;


        document.getElementById(
            "analysisExplanation"
        ).innerText =
            explanation;


        /* -----------------------------------------------
           SCROLL TO RESULT
        ------------------------------------------------ */

        setTimeout(() => {

            resultsCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 200);

    }

