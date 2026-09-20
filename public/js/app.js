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

// ==========================================
// QUIZ SYSTEM (15 CÂU HỎI HOÀN CHỈNH)
// ==========================================
const quizData = [
    {
        question: "1. Trong cấu trúc không gian của phân tử DNA, các base nitơ giữa 2 mạch liên kết với nhau bằng loại liên kết nào?",
        options: ["A. Liên kết ion", "B. Liên kết hydro", "C. Liên kết cộng hóa trị", "D. Liên kết peptide"],
        correct: 1,
        explanation: "Theo nguyên tắc bổ sung, Adenine (A) liên kết với Thymine (T) bằng 2 liên kết hydro, Guanine (G) liên kết với Cytosine (C) bằng 3 liên kết hydro.",
        difficulty: "Cơ bản"
    },
    {
        question: "2. Ở đậu Hà Lan, gen A quy định hạt vàng trội hoàn toàn so với gen a quy định hạt xanh. Cho cây hạt vàng dị hợp (Aa) tự thụ phấn, tỷ lệ kiểu hình ở F1 là bao nhiêu?",
        options: ["A. 100% hạt vàng", "B. 1 hạt vàng : 1 hạt xanh", "C. 3 hạt vàng : 1 hạt xanh", "D. 1 hạt vàng : 3 hạt xanh"],
        correct: 2,
        explanation: "Phép lai Aa × Aa tạo ra tỷ lệ kiểu gen 1 AA : 2 Aa : 1 aa, tương ứng với tỷ lệ kiểu hình 3 hạt vàng (AA, Aa) : 1 hạt xanh (aa).",
        difficulty: "Cơ bản"
    },
    {
        question: "3. Quá trình tổng hợp mRNA dựa trên mạch gốc của DNA được gọi là gì?",
        options: ["A. Tái bản (Nhân đôi)", "B. Phiên mã", "C. Dịch mã", "D. Biến tính"],
        correct: 1,
        explanation: "Phiên mã (Transcription) là quá trình enzym RNA polymerase tổng hợp chuỗi mRNA dựa trên khuôn mẫu của mạch gốc DNA theo nguyên tắc bổ sung.",
        difficulty: "Cơ bản"
    },
    {
        question: "4. Trên phân tử mRNA, bộ ba mở đầu (Start Codon) quy định tổng hợp axit amin mở đầu ở sinh vật nhân thực là gì?",
        options: ["A. UAA", "B. UAG", "C. UGA", "D. AUG"],
        correct: 3,
        explanation: "AUG là mã mở đầu quy định axit amin Methionine ở sinh vật nhân thực. UAA, UAG, UGA là 3 mã kết thúc không quy định axit amin.",
        difficulty: "Trung bình"
    },
    {
        question: "5. Đột biến gen là những biến đổi xảy ra ở cấp độ nào trong cơ thể sinh vật?",
        options: ["A. Cấp độ tế bào", "B. Cấp độ phân tử (cấu trúc của gen/DNA)", "C. Cấp độ cơ thể", "D. Cấp độ quần thể"],
        correct: 1,
        explanation: "Đột biến gen là những biến đổi trong cấu trúc của gen liên quan đến một hoặc một số cặp nucleotide, xảy ra ở cấp độ phân tử.",
        difficulty: "Cơ bản"
    },
    {
        question: "6. Dạng đột biến điểm nào dưới đây làm thay đổi toàn bộ trình tự axit amin trong chuỗi polypeptide từ vị trí đột biến về sau?",
        options: ["A. Thay thế 1 cặp nucleotide", "B. Mất 1 cặp nucleotide", "C. Đảo vị trí 1 cặp nucleotide", "D. Thay thế 2 cặp nucleotide cùng lúc"],
        correct: 1,
        explanation: "Mất (hoặc thêm) 1 cặp nucleotide gây ra hiện tượng dịch khung đọc mã di truyền (frameshift mutation), làm thay đổi toàn bộ trình tự axit amin từ vị trí đó đến cuối chuỗi.",
        difficulty: "Trung bình"
    },
    {
        question: "7. Trong quần thể ngẫu phối đạt cân bằng Hardy-Weinberg, nếu tần số alen lặn a = 0.4 thì tần số cá thể dị hợp (Aa) trong quần thể là bao nhiêu?",
        options: ["A. 0.16 (16%)", "B. 0.36 (36%)", "C. 0.48 (48%)", "D. 0.24 (24%)"],
        correct: 2,
        explanation: "Tần số a (q) = 0.4 => Tần số A (p) = 1 - 0.4 = 0.6. Tỉ lệ kiểu gen dị hợp Aa = 2pq = 2 × 0.6 × 0.4 = 0.48 (48%).",
        difficulty: "Trung bình"
    },
    {
        question: "8. Công nghệ chỉnh sửa gen CRISPR-Cas9 bao gồm 2 thành phần chính cốt lõi nào?",
        options: ["A. DNA polymerase và Ribosome", "B. Guide RNA (gRNA) và Enzyme Cas9", "C. Mạch gốc DNA và tRNA", "D. Restriction Enzyme và Ligase"],
        correct: 1,
        explanation: "Guide RNA đóng vai trò định vị chính xác vị trí DNA mục tiêu, còn Cas9 là enzyme cắt đứt phân tử DNA tại vị trí đó.",
        difficulty: "Trung bình"
    },
    {
        question: "9. Một gen ở sinh vật nhân sơ có chiều dài 4080 Å. Tổng số nucleotide của gen này là bao nhiêu?",
        options: ["A. 1200 nucleotide", "B. 2400 nucleotide", "C. 3000 nucleotide", "D. 4800 nucleotide"],
        correct: 1,
        explanation: "Công thức: N = (Chiều dài L / 3.4 Å) × 2 = (4080 / 3.4) × 2 = 1200 × 2 = 2400 nucleotide.",
        difficulty: "Nâng cao"
    },
    {
        question: "10. Cơ quan nào trong tế bào là nơi trực tiếp diễn ra quá trình Dịch mã (Translation)?",
        options: ["A. Nhân tế bào", "B. Bộ máy Golgi", "C. Ribosome (trong tế bào chất)", "D. Ty thể"],
        correct: 2,
        explanation: "Ribosome bám vào phân tử mRNA tại tế bào chất để đọc mã di truyền và liên kết các axit amin tạo thành chuỗi polypeptide.",
        difficulty: "Cơ bản"
    },
    {
        question: "11. Hội chứng di truyền nào ở người do sự có mặt của 3 nhiễm sắc thể số 21 (Thể ba 2n+1) gây ra?",
        options: ["A. Hội chứng Turner (XO)", "B. Hội chứng Down", "C. Hội chứng Klinefelter (XXY)", "D. Bệnh Máu khó đông"],
        correct: 1,
        explanation: "Hội chứng Down xuất hiện ở người có 3 nhiễm sắc thể số 21 trong tế bào (2n + 1 = 47 NST).",
        difficulty: "Trung bình"
    },
    {
        question: "12. Theo quy luật phân ly độc lập của Mendel, phép lai AaBb × AaBb cho ra tỷ lệ kiểu hình ở đời con F2 là:",
        options: ["A. 3 : 1", "B. 1 : 2 : 1", "C. 9 : 3 : 3 : 1", "D. 1 : 1 : 1 : 1"],
        correct: 2,
        explanation: "Khi lai hai cá thể dị hợp 2 cặp gen (AaBb × AaBb), tích tỷ lệ kiểu hình của từng cặp tính trạng (3:1)(3:1) cho ra tỷ lệ kiểu hình F2 là 9 : 3 : 3 : 1.",
        difficulty: "Trung bình"
    },
    {
        question: "13. Một phân tử mRNA nhân tạo chỉ chứa 2 loại nucleotide Adenine (A) và Uracil (U). Phân tử này có thể có tối đa bao nhiêu loại bộ ba mã hóa (Codon)?",
        options: ["A. 4 loại", "B. 6 loại", "C. 8 loại", "D. 16 loại"],
        correct: 2,
        explanation: "Số bộ ba tối đa tạo thành từ 2 loại nucleotide là 2^3 = 8 bộ ba (AAA, AAU, AUA, AUU, UAA, UAU, UUA, UUU).",
        difficulty: "Nâng cao"
    },
    {
        question: "14. Loại RNA nào mang bộ ba đối mã (Anticodon) và vận chuyển axit amin đến Ribosome trong quá trình dịch mã?",
        options: ["A. mRNA (RNA thông tin)", "B. tRNA (RNA vận chuyển)", "C. rRNA (RNA ribosome)", "D. snRNA"],
        correct: 1,
        explanation: "tRNA (Transfer RNA) mang bộ ba đối mã (Anticodon) khớp bổ sung với Codon trên mRNA để đặt đúng vị trí axit amin vào chuỗi protein.",
        difficulty: "Trung bình"
    },
    {
        question: "15. Trong DNA hai mạch, nguyên tắc bổ sung (A liên kết với T, G liên kết với C) dẫn đến hệ quả nào sau đây?",
        options: ["A. Tỷ lệ A luôn bằng C và G luôn bằng T", "B. Tỷ lệ (A + T) / (G + C) luôn bằng 1", "C. Tổng số A + G luôn bằng tổng số T + C (A + G = T + C = 50%)", "D. Chiều dài DNA phụ thuộc vào số liên kết hydro"],
        correct: 2,
        explanation: "Vì A = T và G = C, nên A + G = T + C = 50% tổng số nucleotide của phân tử DNA 2 mạch.",
        difficulty: "Nâng cao"
    }
];

let currentQuizIndex = 0;
let quizScore = 0;
let isAnswered = false;

function loadQuizQuestion() {
    isAnswered = false;
    const q = quizData[currentQuizIndex];
    const card = document.getElementById('quiz-card');
    if (!card || !q) return;

    card.innerHTML = `
        <div class="flex justify-between items-center text-sm font-semibold text-slate-400 mb-2">
            <span id="quiz-progress-text">Câu hỏi ${currentQuizIndex + 1}/${quizData.length}</span>
            <span id="quiz-difficulty-tag" class="text-amber-400"><i class="fa-solid fa-fire mr-1"></i> Mức độ: ${q.difficulty}</span>
        </div>

        <h3 id="quiz-question-text" class="text-xl sm:text-2xl font-bold text-white leading-snug">
            ${q.question}
        </h3>

        <div id="quiz-options-container" class="space-y-3 pt-4">
            ${q.options.map((opt, idx) => `
                <button onclick="selectQuizOption(${idx})" class="quiz-option-btn w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-200 transition-all font-medium flex items-center justify-between group">
                    <span>${opt}</span>
                    <i class="quiz-status-icon fa-regular fa-circle text-slate-500 group-hover:text-emerald-400 text-lg"></i>
                </button>
            `).join('')}
        </div>

        <div id="quiz-explanation-box" class="hidden p-5 rounded-xl bg-slate-800/80 border border-emerald-500/30 text-sm text-slate-200 mt-6">
            <p id="quiz-explanation-text"><strong>Giải thích:</strong> ${q.explanation}</p>
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-slate-800">
            <span class="text-xs text-slate-400">Điểm số: <strong class="text-emerald-400 font-bold">${quizScore}</strong> / ${currentQuizIndex}</span>
            <button id="quiz-next-btn" onclick="nextQuizQuestion()" class="px-8 py-3.5 rounded-xl gradient-bg text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/40 transition-all opacity-50 cursor-not-allowed" disabled>
                ${currentQuizIndex === quizData.length - 1 ? 'Xem Kết Quả <i class="fa-solid fa-trophy ml-2"></i>' : 'Câu Tiếp Theo <i class="fa-solid fa-arrow-right ml-2"></i>'}
            </button>
        </div>
    `;
}

function selectQuizOption(index) {
    if (isAnswered) return;
    isAnswered = true;

    const q = quizData[currentQuizIndex];
    const optionBtns = document.querySelectorAll('.quiz-option-btn');
    const explanationBox = document.getElementById('quiz-explanation-box');
    const nextBtn = document.getElementById('quiz-next-btn');

    optionBtns.forEach((btn, idx) => {
        btn.disabled = true;
        const icon = btn.querySelector('.quiz-status-icon');

        if (idx === q.correct) {
            btn.classList.remove('bg-slate-800/50', 'border-slate-700', 'hover:bg-slate-700');
            btn.classList.add('bg-emerald-950/80', 'border-emerald-500', 'text-emerald-200');
            if (icon) icon.className = 'quiz-status-icon fa-solid fa-circle-check text-emerald-400 text-xl';
        } else if (idx === index && index !== q.correct) {
            btn.classList.remove('bg-slate-800/50', 'border-slate-700', 'hover:bg-slate-700');
            btn.classList.add('bg-rose-950/80', 'border-rose-500', 'text-rose-200');
            if (icon) icon.className = 'quiz-status-icon fa-solid fa-circle-xmark text-rose-400 text-xl';
        } else {
            btn.classList.add('opacity-50');
        }
    });

    if (index === q.correct) {
        quizScore++;
        if (explanationBox) {
            explanationBox.className = 'p-5 rounded-xl bg-emerald-900/30 border border-emerald-500/50 text-sm text-emerald-100 mt-6';
        }
    } else {
        if (explanationBox) {
            explanationBox.className = 'p-5 rounded-xl bg-rose-900/30 border border-rose-500/50 text-sm text-rose-100 mt-6';
        }
    }

    if (explanationBox) explanationBox.classList.remove('hidden');

    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

function nextQuizQuestion() {
    if (!isAnswered) return;

    currentQuizIndex++;
    if (currentQuizIndex < quizData.length) {
        loadQuizQuestion();
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    const card = document.getElementById('quiz-card');
    if (!card) return;

    const percentage = Math.round((quizScore / quizData.length) * 100);
    let title = "";
    let colorClass = "";
    let icon = "";

    if (percentage >= 80) {
        title = "Xuất Sắc! Bạn Là Chuyên Gia Di Truyền!";
        colorClass = "text-emerald-400";
        icon = "fa-award";
    } else if (percentage >= 50) {
        title = "Tốt Lắm! Bạn Đã Nắm Vững Nền Tảng!";
        colorClass = "text-teal-400";
        icon = "fa-thumbs-up";
    } else {
        title = "Cần Cố Gắng Thêm! Hãy Ôn Lại Lý Thuyết Nhé!";
        colorClass = "text-amber-400";
        icon = "fa-book-open-reader";
    }

    card.innerHTML = `
        <div class="text-center py-8 space-y-6">
            <div class="w-20 h-20 mx-auto rounded-full bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center text-4xl ${colorClass} shadow-xl">
                <i class="fa-solid ${icon}"></i>
            </div>

            <div>
                <h3 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">${title}</h3>
                <p class="text-slate-400 text-sm">Bạn đã hoàn thành bài kiểm tra 15 câu hỏi di truyền học.</p>
            </div>

            <div class="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
                <div class="text-center">
                    <span class="text-xs uppercase font-bold text-slate-400 block">Số câu đúng</span>
                    <span class="text-3xl font-extrabold text-emerald-400 font-mono">${quizScore} / ${quizData.length}</span>
                </div>
                <div class="w-px h-10 bg-slate-800"></div>
                <div class="text-center">
                    <span class="text-xs uppercase font-bold text-slate-400 block">Tỷ lệ đúng</span>
                    <span class="text-3xl font-extrabold ${colorClass} font-mono">${percentage}%</span>
                </div>
            </div>

            <div class="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <button onclick="restartQuiz()" class="px-8 py-3.5 rounded-xl gradient-bg text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/40 transition-all flex items-center justify-center">
                    <i class="fa-solid fa-rotate-right mr-2"></i> Làm Lại Quiz
                </button>
                <button onclick="navigateTo('theory')" class="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center justify-center">
                    <i class="fa-solid fa-book-open mr-2 text-emerald-400"></i> Ôn Lại Lý Thuyết
                </button>
            </div>
        </div>
    `;
}

function restartQuiz() {
    currentQuizIndex = 0;
    quizScore = 0;
    loadQuizQuestion();
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    calculatePunnett();
    runCentralDogmaSim();
    calculateHardyFromP();
    loadQuizQuestion();
});
