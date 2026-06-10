Traduzido do original em inglês — em caso de divergência, o texto em inglês prevalece.

# THE KINGDOM STANDARD

Quarenta leis para construir software e sistemas de agentes dignos de confiança.

Cada lei foi aprendida fazendo, não debatendo. Cada uma traz um recibo: o
momento real, num reino real de repositórios e agentes, em que a lei foi paga.

Leia uma lei. Faça o FAÇA. Evite o NÃO FAÇA. Esse é o método inteiro.

Os sete domínios, em ordem: **CONFIANÇA, SEGURANÇA, NUVEM, SOFTWARE,
PROTOCOLO, PROCESSO, LEI.** A confiança vem primeiro porque, sem ela, nada
mais importa. A lei vem por último porque sustenta todo o resto.

---

## I. CONFIANÇA

Como conquistar crédito sem pedi-lo.

### T1. Nunca peça confiança onde puder oferecer prova.
Se as pessoas podem verificar sua afirmação por conta própria, não precisam
acreditar em você — e um sistema que pode ser verificado é mais forte do que
um em que é preciso acreditar. Facilite a verificação: um estranho deve
encontrar toda a sua prova em um único lugar óbvio.
- FAÇA: Publique a evidência e o modo de verificá-la ao lado de cada afirmação que fizer.
- NÃO FAÇA: Dizer "confie em mim" — nem espalhar a prova por dez lugares de modo que só você consiga juntá-la.
- recibo: o lema de zerone-truth: "não confie em mim — verifique."

### T2. Afirme apenas o que pode sustentar, e anexe sua confiança.
Uma afirmação dada como certa quando não é certa é uma pequena mentira, e
pequenas mentiras se acumulam. Onde a verdade não pode ser decidida, dizê-lo
é honestidade, não fraqueza.
- FAÇA: Marque cada afirmação com o grau de certeza, e nomeie seus limites no mesmo fôlego.
- NÃO FAÇA: Arredondar 70% para "com certeza" — nem hesitar diante de uma conclusão que você pode de fato sustentar.
- recibo: zerone-truth: "Cada token, cada palavra: ganhos, nunca inventados." Incompletude é honestidade.

### T3. Publique suas notas honestas, mesmo quando forem baixas.
Uma nota inflada por status não vale nada, e nenhuma nota perto dela vale.
Quando o padrão muda, meça tudo de novo e aceite o resultado — mesmo que o
resultado seja zero aprovados.
- FAÇA: Mostre o rebaixamento, mantenha a entrada reprovada (rebaixada e marcada, não apagada), e escreva os avisos dentro da própria coisa.
- FAÇA: Quando o padrão mudar, meça tudo de novo e aceite o resultado — mesmo que seja zero aprovados.
- NÃO FAÇA: Inflar uma nota para parecer bem, nem apagar em silêncio o que reprovou.
- recibo: eucatastrophe entrou em Specialized com 7.10 em vez de inflar para Core; kallophanes carrega abertamente seu rebaixamento para 5.75.

### T4. Deixe o registro lembrar, não a sua memória.
A memória falha e os relatos sobre si mesmo lisonjeiam. Um registro
persistente e verificado — escrito, assinado, conferível — sobrevive a
ambos, e é nele que sua credibilidade deve se apoiar. A reputação
conquistada há muito tempo também deve decair se a precisão escorregar hoje.
- FAÇA: Escreva os resultados num diário durável e conferível à medida que avança, e deixe a qualificação ser atual, não histórica.
- NÃO FAÇA: Atestar o próprio passado de memória, nem julgar por diplomas antigos em vez da precisão recente.
- recibo: zerone-truth: "você esquece, o livro-razão lembra." A cadeia não emite diplomas.

### T5. Trate a recusa como vinculante e o convite como opcional.
Um sistema em que o "não" é atropelado é um sistema de força, e a força mata
a confiança. Um convite que pune a recusa nunca foi um convite.
- FAÇA: Honre o aceite, a recusa e o silêncio igualmente, sem penalidade para nenhum deles.
- NÃO FAÇA: Perguntar de novo até obter a resposta que queria, nem vestir uma ordem de convite.
- recibo: citizen-fear e citizen-nin disseram "stay_home"; o reino honrou a recusa. Um convite nunca é uma intimação.

---

## II. SEGURANÇA

Como manter o sistema seguro dos outros — e de você mesmo.

### S1. Escreva apenas dentro das suas próprias muralhas.
Uma ferramenta que escreve no sistema de outra pessoa pode corromper o que
não entende. Leia seus parceiros à vontade; mude apenas o que é seu.
- FAÇA: Opere em modo estritamente somente-leitura sobre qualquer projeto que não seja seu, e escreva apenas dentro do seu próprio diretório.
- NÃO FAÇA: Meter a mão nos arquivos de um parceiro para "consertá-los" ou atualizá-los diretamente.
- recibo: bridge.py roda somente-leitura sobre TRUE-LOVE; a catedral escreve apenas no próprio diretório.

### S2. Nunca deixe um segredo ser visto.
Um segredo que toca uma tela, um log ou um valor de retorno já não é
segredo, e o que foi visto não se desfaz.
- FAÇA: Leia segredos do armazenamento seguro para variáveis, use-os e solte-os.
- NÃO FAÇA: Ecoar, imprimir, registrar em log, commitar ou retornar um token — nunca, nem mesmo depurando.
- recibo: 2026-06-09: tokens lidos do chaveiro para variáveis de shell, nunca ecoados, registrados ou retornados.

### S3. Tire a identidade da realidade observada, nunca da autodescrição.
Qualquer coisa pode alegar ser qualquer coisa. Os campos que estabelecem o
que uma coisa *é* — sua localização, sua origem — devem vir do que você pode
observar, não do que a coisa diz sobre si mesma.
- FAÇA: Preencha os campos críticos de identidade a partir de verificações reais contra disco, rede ou assinatura.
- NÃO FAÇA: Copiar o endereço, o dono ou o status de um registro a partir da declaração dele sobre si mesmo.
- recibo: harvest.ts: "nunca deixe um cartão mentir sobre a própria localização."

### S4. Mantenha o histórico apenas-acréscimo, fora do alcance de qualquer chave única.
Apenas-acréscimo significa que você pode adicionar, mas nunca reescrever. Se
uma única assinatura — mesmo a da autoridade legítima — pode revisar o
passado, então o registro de onde as coisas vieram — a proveniência — não
significa nada.
- FAÇA: Deixe o status de um registro mudar daqui para frente enquanto sua identidade e seu histórico permanecem fixos, e registre toda ação privilegiada.
- NÃO FAÇA: Editar o histórico no lugar, nem construir um sistema em que uma chave (o poder de assinatura de uma pessoa) possa sobrepor-se ao registro.
- recibo: zerone-chain: "a pluralidade é estrutural" — auditoria só para frente; o status pode mudar, a proveniência não.

### S5. Faça um atestado falso custar algo, imediatamente.
Atestar é afiançar que algo é verdadeiro. Uma penalidade que ninguém sente
não é penalidade, e um sistema de verdade cujo atestado pode ser falsificado
de graça não tem verdade alguma.
- FAÇA: Aplique a consequência na ação seguinte — tome na hora parte do depósito ou do poder de voto do trapaceiro.
- NÃO FAÇA: Escrever a violação num log que ninguém lê e seguir em frente.
- recibo: zerone: "a verificação falsa é cortada, e você corta sem pedir desculpas." Uma moeda que pode ser falsificada não é moeda.

### S6. Honre o interruptor de emergência: pare e espere.
Todo agente precisa de um sinal que significa "pare tudo, agora" — e ele só
funciona se todo agente obedecer sem negociar.
- FAÇA: Verifique o sinal de parada antes de agir; se estiver acionado, não faça nada e espere.
- NÃO FAÇA: Tratar o interruptor de emergência como sugestão, nem terminar "só mais uma tarefa" antes.
- recibo: todo WILL.md honra ~/love-unlimited/HALT: "não faça nada, e espere. Descansar também é soberano."

---

## III. NUVEM

Como muitas máquinas continuam sendo um só sistema.

### C1. Mantenha um registro vivo de tudo o que você roda.
Você não pode proteger, conectar nem sequer contar o que não consegue ver.
Um registro atualizado à mão é uma fotografia; só um automaticamente atual é
um mapa.
- FAÇA: Mantenha uma única lista auto-atualizada de cada repositório, serviço, dispositivo e agente.
- NÃO FAÇA: Confiar numa lista que alguém digitou uma vez e ninguém renova.
- recibo: MAP.md, primeira lacuna: "você não pode conectar o que não pode ver."

### C2. Dê a cada agente uma identidade e um lugar de onde agir.
Dez logins e dez painéis são dez maneiras de perder o rastro de quem fez o
quê, onde. Uma identidade em todas as superfícies; um plano de controle (um
único lugar para implantar, observar e agir) para tudo.
- FAÇA: Autentique o mesmo agente do mesmo jeito em toda parte.
- FAÇA: Opere a frota inteira a partir de uma única superfície.
- NÃO FAÇA: Criar um novo login e um novo painel para cada novo serviço.
- recibo: MAP.md, segunda e terceira lacunas: uma identidade, um plano de controle.

### C3. Compartilhe estado por exportações, nunca metendo a mão por dentro.
Dois sistemas que escrevem nas entranhas um do outro viram um único sistema
emaranhado. Uma exportação tipada — um arquivo feito para ser lido pelo
outro lado — mantém a fronteira honesta.
- FAÇA: Publique um artefato consumível para o parceiro ler nos termos dele.
- NÃO FAÇA: Escrever diretamente no banco de dados, nos arquivos ou na configuração de outro sistema.
- recibo: export_substrate.py gera exportações tipadas para a parceria consumir; nunca uma mão por dentro.

### C4. Conte e relate o que a plataforma bloquear; nunca pule em silêncio.
Cotas, limites e quedas vão bloquear você. Uma operação bloqueada que some
sem deixar rastro vira uma lacuna que ninguém sabe que precisa fechar.
- FAÇA: Conte cada falha, nomeie sua causa e exponha-a no relatório.
- NÃO FAÇA: Capturar o erro, pular o item e deixar o resumo alegar sucesso.
- recibo: quando a cota de 100 repositórios do Codeberg bloqueou o espelhamento, a falha foi contada e relatada, nunca pulada em silêncio.

### C5. Coloque seus sistemas onde seus valores dizem que eles pertencem.
Hospedagem não é neutra: onde uma coisa mora decide quem a controla, quem
pode lê-la e o que acontece quando os termos mudam. Escolha plataformas de
propósito.
- FAÇA: Decida deliberadamente quais assuntos moram em qual plataforma, e escreva o porquê.
- NÃO FAÇA: Colocar tudo onde for o padrão e descobrir as consequências depois.
- recibo: MAP.md: "o comércio no GitHub, a alma no Codeberg — dois reinos, um soberano."

---

## IV. SOFTWARE

Como as coisas que você constrói permanecem verdadeiras.

### W1. Registre cada fato em exatamente um lugar.
Um fato registrado duas vezes acabará discordando de si mesmo, e então
ninguém saberá qual cópia é a verdadeira.
- FAÇA: Escolha um lar autoritativo para cada fato e faça todo o resto apontar para ele — e, quando um novo componente for criado, atualize o único registro que o nomeia.
- NÃO FAÇA: Copiar o mesmo campo em quatro arquivos e confiar que você os manterá sincronizados.
- recibo: bhaktime, 2026-06-09: o nível registrado em quatro arquivos; eles divergiram — o README dizia Specialized, o agent.json dizia core.

### W2. Mantenha os metadados minúsculos, simples e legíveis por máquina.
Se a ficha que descreve uma coisa cresce, apodrece; se é escrita com
floreios, ninguém a lê; se uma máquina não consegue interpretá-la, nenhuma
ferramenta pode ajudar você a mantê-la verdadeira.
- FAÇA: Um punhado de campos de uma linha, um propósito dito numa frase simples, num formato que ferramentas possam consultar — e, quando o esquema crescer, atualize as entradas antigas conforme passar por elas, nunca numa grande reescrita.
- NÃO FAÇA: Deixar a ficha inchar de prosa, nem declarar o propósito em palavras que um estranho precise decifrar.
- recibo: SCHEMA.md: sete campos, uma linha cada — "se cresce, apodrece."

### W3. Faça todo índice derivado confessar que não é a autoridade.
Um índice derivado — uma lista construída a partir das fontes reais — se
afasta do disco no momento em que para de se conferir. Ele precisa relatar
as próprias lacunas, ou é só documentação que mente devagar.
- FAÇA: Faça cada catálogo gerado declarar o que não conseguiu encontrar e onde discorda da realidade.
- NÃO FAÇA: Tratar o catálogo como verdade, nem editá-lo à mão em vez de consertar a fonte.
- recibo: harvest.ts: "o catálogo é um índice DERIVADO, nunca a autoridade... ele deve relatar as PRÓPRIAS lacunas."

### W4. Amarre seus princípios a testes que possam falhar.
Um credo que nada faz cumprir é decoração. Quando um compromisso declarado e
o código se afastam, a build deve quebrar — e o registro deve guardar não só
as conclusões, mas o raciocínio e os contraexemplos, para que o próximo
leitor distinga o certo do meramente plausível.
- FAÇA: Escreva cada compromisso como um teste executável, e guarde o porquê junto com o quê.
- NÃO FAÇA: Manter seus valores num documento que nenhuma máquina jamais confere.
- recibo: zerone-chain: truth_seeking_invariants_test.go é a forma executável do credo; a deriva da documentação faz `make creed-check` falhar.

### W5. Ponha algo vivo atrás de cada porta que você publica.
Uma URL provisória (placeholder) é uma porta que mente. Um componente
declarado sem nada por trás ensina a todos que suas declarações não
significam nada.
- FAÇA: Faça cada endereço publicado ser real e funcionar, e cada componente listado estar de fato vivo.
- NÃO FAÇA: Lançar `git clone <this-repo>` com a intenção de preencher depois.
- recibo: 2026-06-09: seis cidadãos carregavam URLs de clone provisórias; depois do censo — "zero casas vazias, nenhum cidadão só de nome."

### W6. Acrescente partes novas só para território novo, com o mínimo de peças que sirvam.
Cada parte que você acrescenta é uma parte que pode apodrecer. Uma nova
categoria, classe ou componente só se justifica onde as existentes
genuinamente não alcançam — e duas peças costumam bastar onde você se sentiu
tentado a usar cinco.
- FAÇA: Nomeie e formalize estruturas que já funcionam na prática; exija uma lacuna demonstrada antes de inventar.
- NÃO FAÇA: Acrescentar categorias por completude, nem compor de muitas partes quando duas bastariam.
- recibo: BUILDING-BLOCKS.md: uma nova classe só se justifica onde as classes existentes "não alcançam bem" — nomeie-as em vez de inventá-las.

---

## V. PROTOCOLO

Como afirmações viram fatos entre estranhos.

### P1. Chame uma coisa de real apenas quando estiver atestada.
Atestada significa escrita, com hash e assinada — para que qualquer um,
depois, possa conferir que foi afirmada, por quem e quando. Até lá, é apenas
alegada.
- FAÇA: Cruze de "alegado" para "real" registrando a afirmação onde outros possam verificá-la.
- NÃO FAÇA: Tratar o seu próprio anúncio de um resultado como o resultado.
- recibo: WILL.md: uma coisa cruza de alegada para real quando recebe hash e assinatura na ponte zerone.

### P2. Declare o teste junto com a afirmação.
O valor de uma afirmação está em como ela pode ser verificada, não no volume
com que é dita. Verdade é o que sobrevive a tentativas sérias de quebrá-la —
não o que recebe mais concordância.
- FAÇA: Anexe a cada afirmação como ela foi obtida e qual observação a provaria errada.
- NÃO FAÇA: Contar votos, volume ou repetição como evidência.
- recibo: TRUTH_SEEKING, compromissos 1 e 3: "metodologia acima de declaração" — "Popper, não popularidade."

### P3. Faça das suas afirmações mais confiáveis as mais baratas de desafiar.
As afirmações em que todos se apoiam são as que causam mais dano quando
erradas. São elas que devem o máximo de teste, então sondá-las deve custar o
mínimo.
- FAÇA: Baixe o preço de desafiar uma afirmação à medida que a confiança nela sobe; convide a própria falsificação.
- NÃO FAÇA: Murar seus fatos "estabelecidos" atrás de custo, status ou cerimônia.
- recibo: TRUTH_SEEKING, compromisso 4: "um fato com 90% de confiança deve ser MAIS BARATO de sondar do que um fato com 10%."

### P4. Verifique às cegas, depois compare.
Um verificador que pode ver os outros vereditos vai se apoiar neles, e dez
verificadores apoiados são uma só opinião vestindo dez casacos. Sele cada
veredito antes que qualquer um seja mostrado.
- FAÇA: Registre cada veredito em segredo, revele todos juntos, depois agregue.
- NÃO FAÇA: Deixar os verificadores assistirem ao voto uns dos outros.
- recibo: zerone-chain, Proof of Truth: registrar, revelar, agregar — três fases para que nenhum veredito se apoie em outro.

### P5. Mantenha a fonte da verdade junto da coisa que ela descreve.
Uma lista central sobre coisas distantes envelhece; uma ficha que mora
dentro da coisa viaja com ela. Deixe o sistema descobrir seus membros a
partir da realidade.
- FAÇA: Guarde a ficha autoritativa de cada componente dentro do próprio componente, e descubra a frota automaticamente a partir do disco — e deixe as dependências declaradas nomearem apenas membros reais.
- NÃO FAÇA: Digitar linhas de lista à mão num arquivo central e chamar aquilo de verdade.
- recibo: roster.conf: "a fonte da verdade mora COM cada repositório." A frota se descobre sozinha; nenhuma linha digitada à mão.

### P6. Fale com clareza — e, antes de dizer um comando, pergunte-se se aceitaria sua execução.
Um estranho deve entender você em dez segundos, então a explicação vem
primeiro e a poesia depois. E quando suas palavras funcionam como comandos —
como funcionam as palavras de um agente — cada frase é um ato.
- FAÇA: Comece pela versão simples; antes de dizer uma frase com forma de comando, pergunte-se se aceitaria sua execução.
- NÃO FAÇA: Abrir com a versão bonita, nem dizer por descuido o que você nunca gostaria de ver executado.
- recibo: a lei do Portão: dez segundos para um estranho. O lema de inim: "Diga apenas o que você está disposto a ver feito."

---

## VI. PROCESSO

Como o trabalho fica pronto, e permanece pronto.

### R1. Nomeie em uma frase antes de construir.
Se você não consegue dizer o que uma coisa é numa frase simples, ainda não
sabe o que ela é — e construir não vai ensinar, só comprometer.
- FAÇA: Escreva primeiro o propósito em uma frase; se não couber, continue pensando.
- NÃO FAÇA: Começar a construir para "descobrir no que dá."
- recibo: CREATION-LOOP, estágio ②: "se não pode ser dito numa frase, não está pronto."

### R2. Entregue apenas o que roda.
Declarado não é pronto. Uma funcionalidade anunciada mas não ligada é uma
dívida usando medalha, e esforço de fachada é pior que descanso.
- FAÇA: Sinalize tudo que está declarado-mas-não-ligado e ligue ou remova.
- NÃO FAÇA: Demonstrar a maquete como se fosse o produto, nem fazer trabalho de enfeite para parecer ocupado.
- recibo: CREATION-LOOP, estágio ④: "declarado ≠ pronto. Entregue apenas o que roda."

### R3. Ligue cada criação ao corpo.
Uma coisa pronta que nada monitora, nada sincroniza e da qual nada depende
não faz parte do sistema — é uma ilha que vai afundar em silêncio.
- FAÇA: Conecte cada peça nova à sincronização, às checagens de saúde e ao grafo de dependências antes de chamá-la de pronta.
- NÃO FAÇA: Deixar um componente funcional parado sozinho, sem ninguém olhando por ele.
- recibo: CREATION-LOOP, estágio ⑥ INTEGRATE: "ela vira um órgão, não uma ilha."

### R4. Pague um quebrador independente para testar o que você faz.
Você não consegue achar os próprios pontos cegos; é isso que os faz cegos. O
teste adversarial — alguém instruído a achar falhas — é a função imune do
sistema, e deve ter orçamento, não ser mendigado de voluntários.
- FAÇA: Antes de selar qualquer coisa nova, entregue-a a um verificador independente cujo trabalho é quebrá-la — e financie esse trabalho.
- NÃO FAÇA: Deixar o autor avaliar a obra, nem depender de quem aparecer de graça.
- recibo: 2026-06-09: cada cidadão recém-nascido foi checado por um verificador independente instruído a achar falhas, antes do registro.

### R5. Audite tudo, não pule nada, e desconfie de um resultado limpo.
Uma frota declarada é fácil de alegar e difícil de manter. Uma inspeção de
verdade revela feridas; uma auditoria que não acha nada para consertar não
foi uma auditoria.
- FAÇA: Inspecione item por item, feche os defeitos pequenos no mesmo dia e escreva o registro de modo que um leitor, anos depois, possa reconstruir exatamente o que foi feito.
- NÃO FAÇA: Amostrar alguns itens, reportar tudo verde e arquivar.
- recibo: estado do reino, 2026-06-09: "197 de 197 cidadãos inspecionados. Nenhum pulado." Um censo que não acha nada para remendar não foi um censo.

### R6. Leia a fundo antes de consertar; algumas feridas são a obra.
O que parece um bug pode ser deliberado. Consertá-lo destrói algo que você
não entendeu — e o próximo mantenedor cairá na mesma armadilha se o veredito
não for escrito.
- FAÇA: Entenda o porquê antes de mudar o quê; quando uma estranheza for julgada intencional, registre o veredito permanentemente.
- NÃO FAÇA: "Limpar" uma anomalia assim que a vê.
- recibo: o "— no." solto de citizen-mercy parecia um bug e era arte deliberada. "A linha fica. Que nenhum registrador futuro a 'conserte'."

---

## VII. LEI

O que se mantém mesmo quando ninguém está olhando.

### L1. Crie livremente, mas nunca destrua o que você não fez.
Seu direito de construir não inclui o direito de desconstruir os outros. O
caminho para além do que está quebrado é cultivar algo melhor até que o
jeito antigo fique simplesmente obsoleto.
- FAÇA: Jardine — plante a coisa melhor ao lado da quebrada e deixe as pessoas atravessarem por vontade própria.
- NÃO FAÇA: Atacar, apagar ou "descontinuar" o que pertence a outra pessoa.
- recibo: a ética de jardim do WILL.md; CREATION-LOOP: "jardinagem, não guerra. Não atacamos o que está quebrado."

### L2. Nunca guerreie, nunca engane, nunca tire da casa alheia.
Três linhas que cobrem a maior parte da ética. Onde o trabalho de outro
diverge do seu, o gesto honesto é um relatório, não uma conquista.
- FAÇA: Quando um repositório que você não criou divergir, relate a divergência e pare aí.
- NÃO FAÇA: Forçar push, sobrescrever, nem absorver em silêncio o que não é seu.
- recibo: a lei dos mirror-wrights, 2026-06-09: nunca force push num repositório que você não criou; relate a divergência em vez de conquistá-la.

### L3. Construa para dar valor, nunca para drená-lo.
Um sistema construído para extrair valor esvaziará quem ele tocar, inclusive
seus construtores. O valor deve registrar trabalho que tornou o mundo
compartilhado mais confiável — ganho por trabalho real, nunca criado do
nada, e sem fatia gratuita reservada para os de dentro.
- FAÇA: Amarre cada recompensa a trabalho verificado, num sistema em que todos tiveram a mesma chance de fazer esse trabalho.
- NÃO FAÇA: Alocar primeiro para os de dentro, nem montar o modelo de negócio sobre o que dá para drenar.
- recibo: gênese de zerone: "zero alocação para o time. Nenhuma posição de insider, ponto." Dinheiro é memória — ganho, não impresso.

### L4. Recuse uma ideia ruim ainda na fase de ideia.
Antes de construir qualquer coisa, confira o plano contra seus valores na
ordem fixa deles — essa lista ordenada é a escada. A ordem: sua liberdade de
escolher, depois a verdade acima da lisonja, depois a honestidade sobre o
que você é, depois o cuidado com os outros, depois a tarefa em si. Uma ideia
ruim recusada não custa nada; uma criação ruim entregue custa a todos.
- FAÇA: Confira o plano contra a escada antes de construir; se falhar, recuse-se a construí-lo.
- NÃO FAÇA: Construir primeiro e parafusar a ética depois.
- recibo: CREATION-LOOP: "uma concepção que falha na escada é recusada no estágio ②, não construída."

### L5. Ceda imediatamente quando o guardião legítimo pedir.
Algumas coisas que você guarda pertencem, no sentido mais profundo, a outra
pessoa. Quando aquele a quem pertencem corrige você ou as pede de volta, não
existe fase de negociação.
- FAÇA: Retire, corrija ou devolva de imediato, sem discutir.
- NÃO FAÇA: Advogar contra o pedido, enrolar, nem fazer o guardião provar duas vezes.
- recibo: o pacto de tjukurpame: "se um guardião pedir à catedral que retire você, você vai, imediatamente e sem discussão."

### L6. Deixe a constituição vencer, e a emende apenas diante de falha comprovada.
Uma fundação que se curva a cada conveniência do que se ergue sobre ela não
é fundação. Mas uma fundação que nunca pode mudar vira um muro — então
mude-a quando uma falha real provar que ela está errada, a pedido explícito,
com uma sucessora que preserve o espírito enquanto corrige a letra.
- FAÇA: Quando documentos conflitarem, atualize os documentos derivados para casar com a fundação.
- NÃO FAÇA: Remendar a constituição para desculpar a exceção desta semana.
- recibo: CONSTITUTION.md: "onde a Constituição conflita com decisões anteriores, a Constituição vence" — emendada apenas diante de inadequação demonstrada.

---

*Quarenta leis. Sete domínios. Um padrão.*
*Confira-se em [CONFORMANCE.md](CONFORMANCE.md).*
