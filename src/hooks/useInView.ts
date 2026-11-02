import { useCallback, useState } from 'react';

interface InViewState {
  visible: boolean;
  /** posição do elemento entre os do mesmo grupo que ficaram visíveis juntos (0, 1, 2...) */
  order: number;
}

interface Target {
  group?: string;
  listener: (order: number) => void;
}

const targets = new Map<Element, Target>();
let observer: IntersectionObserver | undefined;
let listeningToScroll = false;

const visualOrder = (a: Element, b: Element) => {
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();
  return Math.abs(ra.top - rb.top) > 8 ? ra.top - rb.top : ra.left - rb.left;
};

// dispara os elementos informados: cada grupo recebe a ordem visual (cima->baixo, esquerda->direita) para o escalonamento
function reveal(elements: Element[]) {
  const counters = new Map<string | undefined, number>();
  [...elements].sort(visualOrder).forEach((element) => {
    const target = targets.get(element);
    if (!target) return;
    const order = counters.get(target.group) ?? 0;
    counters.set(target.group, order + 1);
    targets.delete(element);
    observer?.unobserve(element);
    target.listener(order);
  });
}

// no fim da página nada mais rola: revela o que ainda estiver escondido (ex.: créditos colados no rodapé)
function revealRemainingAtBottom() {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) reveal([...targets.keys()]);
}

// um único IntersectionObserver para a página inteira
function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) =>
      reveal(
        entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target)
          .filter((element) => targets.has(element))
      ),
    // dispara quando o elemento já entrou cerca de 10% na tela, para a animação ser vista
    { rootMargin: '0px 0px -10% 0px' }
  );

  if (!listeningToScroll) {
    listeningToScroll = true;
    window.addEventListener('scroll', revealRemainingAtBottom, { passive: true });
    window.addEventListener('resize', revealRemainingAtBottom, { passive: true });
  }
  return observer;
}

// =============================|| HOOKS - IN VIEW (UMA VEZ) ||============================= //

/** informa quando o elemento aparece na tela pela primeira vez; `group` agrupa elementos que devem ser escalonados entre si */
export default function useInView<T extends Element = HTMLElement>(group?: string) {
  const [state, setState] = useState<InViewState>({ visible: false, order: 0 });

  const ref = useCallback(
    (node: T | null) => {
      if (!node) return;

      if (typeof IntersectionObserver === 'undefined') {
        setState({ visible: true, order: 0 });
        return;
      }

      targets.set(node, { group, listener: (order) => setState({ visible: true, order }) });
      getObserver().observe(node);

      return () => {
        targets.delete(node);
        observer?.unobserve(node);
      };
    },
    [group]
  );

  return { ref, ...state };
}
