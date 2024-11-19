import ScrollPlayer from "@/app/components/common/scrollPlayer";

export default function Play() {
  const str = `场景英语表达分析答卷
应用 (Application)
基础描述版本:
"Speaking of odd-form component placement machines, JUKI from Japan has earned industry-wide recognition. Its emergence represents a game-changing breakthrough. It can handle components that other machines fail to recognize or place properly. While other equipment can operate, JUKI achieves high-speed operation with remarkable ease. The performance gap is substantial."
中文：说到异形插件机，日本JUKI获得了行业的广泛认可。它的出现代表着一次突破性的进展。它能处理其他设备无法识别或无法正确放置的元件。当其他设备仅能运作时，JUKI却能轻松实现高速运转。这种性能差距非常显著。
场合变体:
对同事:
"Have you seen the JUKI odd-form placement system? It's incredibly versatile - handles components that give other machines headaches. The specs are impressive: 47K CPH theoretical capacity, dealing with components down to 008004. Pretty amazing, right?"
中文：你见过JUKI的异形贴装系统吗？它的通用性令人惊叹 - 能处理让其他机器都头疼的元件。规格令人印象深刻：理论产能47K CPH，可处理小至008004的元件。很厉害，对吧？
对管理层:
"The JUKI odd-form placement solution offers exceptional ROI. With proven reliability over 20+ years and thousands of installations, it combines high performance with operational simplicity and cost-effectiveness."
中文：JUKI异形贴装解决方案提供卓越的投资回报。经过20多年和数千台设备的验证，它将高性能与操作简便性和成本效益完美结合。
对客户:
"Let me introduce you to JUKI's odd-form placement series - the industry benchmark for handling challenging components. Whether you're dealing with micro-components or complex placements, these machines deliver consistent precision and reliability."
中文：让我为您介绍JUKI的异形贴装系列 - 处理挑战性元件的行业标杆。无论是微型元件还是复杂布置，这些设备都能提供始终如一的精确性和可靠性。
分析 (Analysis)
关键表达解析:
"Game-changing breakthrough" vs "Revolutionary advancement":

前者强调颠覆性改变
后者强调革新性进步
在描述JUKI的市场影响时，"game-changing"更贴切，暗示了竞争格局的改变

"Handles with ease" vs "Manages efficiently":

前者强调轻松自如
后者强调高效管理
描述JUKI性能优势时，"handles with ease"更能传达出设备的从容表现

评估 (Evaluation)
表达效果比较:
描述性能优势:

"Sets new industry standards" (强调引领性)
"Outperforms conventional solutions" (强调超越性)
"Delivers unmatched capabilities" (强调独特性)

描述可靠性:

"Time-tested reliability" (强调经过时间验证)
"Proven track record" (强调成功历史)
"Consistently dependable performance" (强调稳定可靠)

创造 (Creation)
个性化表达:
技术优势描述:
"While others struggle with complex components, JUKI's solution makes it look effortless - that's what we call engineering excellence."
中文：当其他设备在处理复杂元件时举步维艰，JUKI的解决方案却显得轻而易举 - 这就是我们所说的工程卓越。
性能描述:
"From micro-components at 008004 to high-speed operations at 47K CPH - JUKI doesn't just raise the bar, it redefines what's possible."
中文：从008004微型元件到47K CPH的高速运转 - JUKI不仅提高了标准，更重新定义了可能性。
实践建议
情境扩展:
快速介绍版:
"JUKI - industry-leading odd-form placement solutions with proven reliability and exceptional performance."
中文：JUKI - 业内领先的异形贴装解决方案，具有公认的可靠性和卓越的性能。
详细技术版:
"The JUKI solution offers micron-level precision, millisecond-level placement cycles, and comprehensive component handling capabilities, making it the go-to choice for demanding production environments."
中文：JUKI解决方案提供微米级精度、毫秒级贴装周期和全面的元件处理能力，使其成为高要求生产环境的首选。
性能亮点版:
"Features that stand out: 47K CPH theoretical capacity, handling of 008004 components, proven reliability across thousands of installations, and user-friendly operation."
中文：突出特点：47K CPH理论产能、处理008004元件的能力、数千台设备验证的可靠性以及用户友好的操作。`;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <ScrollPlayer
        audioUrl="https://nuo-english.s3.us-east-2.amazonaws.com/juki.wav"
        text={str}
      />
    </div>
  );
}
