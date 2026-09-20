// Navigation Controller
function navigateTo(sectionId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.classList.add('hidden'));

    const target = document.getElementById(`section-${sectionId}`);
    if (target) {
        target.classList.remove('hidden');
    }

    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.classList.remove('text-emerald-400', 'bg-slate-800/80', 'border', 'border-emerald-500/30');
        btn.classList.add('text-slate-300');
    });

    const activeBtn = document.getElementById(`nav-${sectionId}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-300');
        activeBtn.classList.add('text-emerald-400', 'bg-slate-800/80', 'border', 'border-emerald-500/30');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function switchTheoryTab(topicKey) {
    const contents = document.querySelectorAll('.theory-content');
    contents.forEach(c => c.classList.add('hidden'));

    const activeContent = document.getElementById(`theory-content-${topicKey}`);
    if (activeContent) activeContent.classList.remove('hidden');

    const buttons = document.querySelectorAll('.theory-tab-btn');
    buttons.forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white', 'shadow-md');
        b.classList.add('text-slate-300', 'hover:bg-slate-800');
    });

    const activeBtn = document.getElementById(`tab-btn-${topicKey}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-300', 'hover:bg-slate-800');
        activeBtn.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
    }
}

function openTheoryTopic(topicKey) {
    navigateTo('theory');
    switchTheoryTab(topicKey);
}

function switchLabTool(toolKey) {
    const tools = document.querySelectorAll('.lab-tool-content');
    tools.forEach(t => t.classList.add('hidden'));

    const activeTool = document.getElementById(`lab-tool-${toolKey}`);
    if (activeTool) activeTool.classList.remove('hidden');

    const buttons = document.querySelectorAll('.lab-tab-btn');
    buttons.forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white', 'shadow-md');
        b.classList.add('text-slate-400');
    });

    const activeBtn = document.getElementById(`lab-tab-${toolKey}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-400');
        activeBtn.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
    }
}

// Punnett Square Calculations
function getGametes(genotype) {
    if (genotype.length === 2) {
        return [genotype[0], genotype[1]];
    } else if (genotype.length === 4) {
        const g1 = genotype.substring(0, 2);
        const g2 = genotype.substring(2, 4);
        return [
            g1[0] + g2[0],
            g1[0] + g2[1],
            g1[1] + g2[0],
            g1[1] + g2[1]
        ];
    }
    return [];
}

function combineGametes(g1, g2) {
    if (g1.length === 1) {
        const letters = [g1, g2].sort((a, b) => {
            if (a.toUpperCase() === b.toUpperCase()) {
                return a === a.toUpperCase() ? -1 : 1;
            }
            return a.localeCompare(b);
        });
        return letters.join('');
    } else {
        const geneA = [g1[0], g2[0]].sort((a, b) => a === a.toUpperCase() ? -1 : 1).join('');
        const geneB = [g1[1], g2[1]].sort((a, b) => a === a.toUpperCase() ? -1 : 1).join('');
        return geneA + geneB;
    }
}

function calculatePunnett() {
    const p1 = document.getElementById('punnett-p1').value;
    const p2 = document.getElementById('punnett-p2').value;

    if (p1.length !== p2.length) {
        document.getElementById('punnett-grid-container').innerHTML = 
            `<p class="text-rose-400 font-bold p-4">Vui lòng chọn cùng kiểu lai cho cả Bố và Mẹ!</p>`;
        return;
    }

    const gametes1 = getGametes(p1);
    const gametes2 = getGametes(p2);

    let tableHTML = `<table class="w-full text-center font-mono border-collapse border border-slate-700 rounded-xl overflow-hidden">`;
    tableHTML += `<tr class="bg-slate-900 border-b border-slate-700">`;
    tableHTML += `<th class="p-3 border-r border-slate-700 text-emerald-400 text-xs">P1 \\ P2</th>`;
    gametes2.forEach(g => {
        tableHTML += `<th class="p-3 border-r border-slate-700 text-amber-300 font-bold">${g}</th>`;
    });
    tableHTML += `</tr>`;

    const genotypesCount = {};
    let totalCombos = 0;

    gametes1.forEach(g1 => {
        tableHTML += `<tr class="border-b border-slate-800 hover:bg-slate-900/50">`;
        tableHTML += `<td class="p-3 border-r border-slate-700 text-emerald-300 font-bold bg-slate-900">${g1}</td>`;
        
        gametes2.forEach(g2 => {
            const combo = combineGametes(g1, g2);
            genotypesCount[combo] = (genotypesCount[combo] || 0) + 1;
            totalCombos++;

            tableHTML += `<td class="p-3 border-r border-slate-800 text-white font-bold bg-slate-950/60">${combo}</td>`;
        });
        tableHTML += `</tr>`;
    });
    tableHTML += `</table>`;

    document.getElementById('punnett-grid-container').innerHTML = tableHTML;

    // Genotype Ratios
    let genotypeHTML = '';
    for (const [genotype, count] of Object.entries(genotypesCount)) {
        const percent = ((count / totalCombos) * 100).toFixed(1);
        genotypeHTML += `<div class="flex justify-between border-b border-slate-800/60 py-1"><span>${genotype}:</span> <span class="text-emerald-400">${count}/${totalCombos} (${percent}%)</span></div>`;
    }
    document.getElementById('genotype-ratios').innerHTML = genotypeHTML;

    // Phenotype Ratios
    let phenotypeHTML = '';
    const phenotypesCount = {};
    if (p1.length === 2) {
        for (const [genotype, count] of Object.entries(genotypesCount)) {
            const pheno = genotype.includes('A') ? 'Trội (A-)' : 'Lặn (aa)';
            phenotypesCount[pheno] = (phenotypesCount[pheno] || 0) + count;
        }
    } else {
        for (const [genotype, count] of Object.entries(genotypesCount)) {
            const hasA = genotype.includes('A');
            const hasB = genotype.includes('B');
            let pheno = '';
            if (hasA && hasB) pheno = 'Trội A, Trội B (A-B-)';
            else if (hasA && !hasB) pheno = 'Trội A, Lặn b (A-bb)';
            else if (!hasA && hasB) pheno = 'Lặn a, Trội B (aaB-)';
            else pheno = 'Lặn a, Lặn b (aabb)';
            phenotypesCount[pheno] = (phenotypesCount[pheno] || 0) + count;
        }
    }

    for (const [pheno, count] of Object.entries(phenotypesCount)) {
        const percent = ((count / totalCombos) * 100).toFixed(1);
        phenotypeHTML += `<div class="flex justify-between border-b border-slate-800/60 py-1"><span>${pheno}:</span> <span class="text-teal-400">${count}/${totalCombos} (${percent}%)</span></div>`;
    }
    document.getElementById('phenotype-ratios').innerHTML = phenotypeHTML;
}

// Central Dogma Simulation
const codonTable = {
    'AUG': 'Met (Start)', 'UUU': 'Phe', 'UUC': 'Phe', 'UUA': 'Leu', 'UUG': 'Leu',
    'CUU': 'Leu', 'CUC': 'Leu', 'CUA': 'Leu', 'CUG': 'Leu', 'AUU': 'Ile',
    'AUC': 'Ile', 'AUA': 'Ile', 'GUU': 'Val', 'GUC': 'Val', 'GUA': 'Val',
    'GUG': 'Val', 'UCU': 'Ser', 'UCC': 'Ser', 'UCA': 'Ser', 'UCG': 'Ser',
    'CCU': 'Pro', 'CCC': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro', 'ACU': 'Thr',
    'ACC': 'Thr', 'ACA': 'Thr', 'ACG': 'Thr', 'GCU': 'Ala', 'GCC': 'Ala',
    'GCA': 'Ala', 'GCG': 'Ala', 'UAU': 'Tyr', 'UAC': 'Tyr', 'UAA': 'STOP',
    'UAG': 'STOP', 'UGA': 'STOP', 'CAU': 'His', 'CAC': 'His', 'CAA': 'Gln',
    'CAG': 'Gln', 'AAU': 'Asn', 'AAC': 'Asn', 'AAA': 'Lys', 'AAG': 'Lys',
    'GAU': 'Asp', 'GAC': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu', 'UGU': 'Cys',
    'UGC': 'Cys', 'UGG': 'Trp', 'CGU': 'Arg', 'CGC': 'Arg', 'CGA': 'Arg',
    'CGG': 'Arg', 'AGA': 'Arg', 'AGG': 'Arg', 'AGU': 'Ser', 'AGC': 'Ser',
    'GGU': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly'
};

function runCentralDogmaSim() {
    let rawDna = document.getElementById('dna-input').value.toUpperCase().replace(/[^ATGC]/g, '');
    if (!rawDna) return;

    let formattedDna = rawDna.match(/.{1,3}/g)?.join(' ') || rawDna;
    document.getElementById('visual-dna').textContent = formattedDna;

    let mrna = '';
    for (let char of rawDna) {
        if (char === 'A') mrna += 'U';
        else if (char === 'T') mrna += 'A';
        else if (char === 'G') mrna += 'C';
        else if (char === 'C') mrna += 'G';
    }

    let formattedMrna = mrna.match(/.{1,3}/g)?.join(' ') || mrna;
    document.getElementById('visual-mrna').textContent = formattedMrna;

    const codons = mrna.match(/.{1,3}/g) || [];
    let aminoAcidsHTML = '';

    codons.forEach(codon => {
        if (codon.length === 3) {
            const aa = codonTable[codon] || 'Unknown';
            let badgeStyle = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
            if (aa.includes('Start')) badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
            if (aa === 'STOP') badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';

            aminoAcidsHTML += `
                <div class="px-3 py-1.5 rounded-lg border text-xs font-mono flex flex-col items-center ${badgeStyle}">
                    <span class="text-[10px] opacity-70">${codon}</span>
                    <span>${aa}</span>
                </div>
            `;
        }
    });

    document.getElementById('visual-protein').innerHTML = aminoAcidsHTML || '<span class="text-slate-500 text-xs">Chưa đủ bộ ba</span>';
}

// Hardy-Weinberg Calculation
function calculateHardyFromP() {
    let p = parseFloat(document.getElementById('hw-p-input').value);
    if (isNaN(p) || p < 0 || p > 1) return;

    let q = 1 - p;
    let p2 = p * p;
    let two_pq = 2 * p * q;
    let q2 = q * q;

    document.getElementById('hw-res-p').textContent = p.toFixed(2);
    document.getElementById('hw-res-q').textContent = q.toFixed(2);
    document.getElementById('hw-res-p2').textContent = (p2 * 100).toFixed(1) + '%';
    document.getElementById('hw-res-2pq').textContent = (two_pq * 100).toFixed(1) + '%';
}

// Quiz System
const quizData = [
    {
        question: "1. Trong thí nghiệm lai hai cặp tính trạng của Mendel (AaBb x AaBb), tỉ lệ kiểu hình thu được ở F2 là bao nhiêu?",
        options: ["3 : 1", "9 : 3 : 3 : 1", "1 : 2 : 1", "1 : 1 : 1 : 1"],
        correct: 1,
        explanation: "Khi cho cơ thể dị hợp 2 cặp gen (AaBb) tự thụ phấn, tỉ lệ kiểu hình thu được ở F2 là 9 A-B- : 3 A-bb : 3 aaB- : 1 aabb."
    },
    {
        question: "2. Loại liên kết hóa học nào nối giữa các bazo nitơ bổ sung ở hai mạch đơn của DNA?",
        options: ["Phosphodiester", "Liên kết Hydro", "Liên kết Peptide", "Liên kết Ion"],
        correct: 1,
        explanation: "Các bazo nitơ bổ sung liên kết với nhau bằng liên kết Hydro (A=T 2 liên kết, G≡C 3 liên kết)."
    }
];

let currentQuizIndex = 0;

function loadQuizQuestion() {
    const q = quizData[currentQuizIndex];
    if (!q) return;

    document.getElementById('quiz-question-text').textContent = q.question;
    const container = document.getElementById('quiz-options-container');
    container.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-200 font-medium';
        btn.textContent = opt;
        btn.onclick = () => {
            document.getElementById('quiz-explanation-text').textContent = q.explanation;
            document.getElementById('quiz-explanation-box').classList.remove('hidden');
            document.getElementById('quiz-next-btn').classList.remove('hidden');
        };
        container.appendChild(btn);
    });
}

function nextQuizQuestion() {
    currentQuizIndex = (currentQuizIndex + 1) % quizData.length;
    document.getElementById('quiz-explanation-box').classList.add('hidden');
    document.getElementById('quiz-next-btn').classList.add('hidden');
    loadQuizQuestion();
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    calculatePunnett();
    runCentralDogmaSim();
    calculateHardyFromP();
    loadQuizQuestion();
});