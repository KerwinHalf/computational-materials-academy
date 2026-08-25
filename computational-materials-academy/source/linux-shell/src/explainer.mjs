const commandGlossary = {
  pwd:['print working directory','显示当前工作目录的绝对路径。','当你不确定“我现在到底在哪个目录”时先用它，科研服务器上尤其重要。'],
  cd:['change directory','切换当前工作目录。','`cd DIR` 进入目录；`cd ..` 返回上一级；`cd ~` 回到家目录。'],
  ls:['list','列出目录内容。','常和 `-l`（详细信息）、`-a`（包含隐藏文件）、`-h`（人类可读大小）组合。'],
  touch:['touch','创建空文件，或更新已有文件的时间戳。','常用于快速创建脚本或占位文件。'],
  mkdir:['make directory','创建目录。','`mkdir -p` 可以连同缺失的父目录一起创建，并避免“目录已存在”报错。'],
  cp:['copy','复制文件或目录。','源文件在前，目标在最后；`-p` 尽量保留时间戳、权限等属性。'],
  mv:['move','移动或重命名文件/目录。','同一文件系统内移动目录通常很快，但目标路径写错也会把东西挪到奇怪地方。'],
  rm:['remove','删除文件或目录。','`rm` 基本不可撤销。`-r` 递归目录，`-f` 强制且少提示，科研目录里要非常谨慎。'],
  cat:['concatenate','直接把文件内容输出到终端。','适合短文件；OUTCAR 这种巨型文件更适合 `less`、`grep`、`tail`。'],
  less:['less pager','分页查看文本。','适合大文件，支持搜索；按 `q` 退出。'],
  head:['head','查看文本开头若干行。','`head -n 20 FILE` 查看前 20 行。'],
  tail:['tail','查看文本末尾若干行。','`tail -n 30 OSZICAR` 看最后 30 行；`tail -f` 持续跟踪追加内容。'],
  wc:['word count','统计输入中的行数、单词数、字节数等。','常用 `-l` 统计行数。注意 `l` 是 line 的小写 L，不是数字 1。'],
  grep:['global regular expression print','搜索文本中符合模式的行。','科研排错最常用工具之一，可筛 E-fermi、ERROR、BRMIX 等关键词。'],
  sed:['stream editor','按规则查看、替换或编辑文本流。','`sed -n` 常配合 `p` 精确打印行范围；`-i` 会直接改原文件，应先备份。'],
  awk:['awk','按字段处理结构化文本。','默认以空白分字段，`$1` 是第一列，`NR` 是当前行号，`NF` 是字段数。'],
  cut:['cut','按分隔符或字符位置切取字段。','例如 `cut -d: -f1` 用冒号分隔并取第一列。'],
  sort:['sort','对文本行排序。','常与 `find`、`uniq` 组合整理文件列表。'],
  uniq:['unique','合并相邻重复行。','通常先 `sort` 再 `uniq`，因为它只识别相邻重复。'],
  tr:['translate','替换或删除字符。','适合简单字符级转换，例如大小写或分隔符。'],
  paste:['paste','按列合并多个文件的对应行。','适合把多列科研结果拼到一起。'],
  column:['column','把文本按列对齐显示。','常用于让终端里的表格更易读。'],
  find:['find','递归搜索目录树中的文件或目录。','`.` 表示从当前目录开始；可用 `-type`、`-name`、`-maxdepth` 等限制条件。'],
  xargs:['extended arguments','把标准输入转换成后续命令的参数。','功能很强，但涉及空格文件名或删除操作时必须谨慎，优先理解 `-0` / `find -print0`。'],
  echo:['echo','把文本或变量值输出到标准输出。','也常用于 dry-run：先 `echo rm ...` 看将要执行什么，而不真的删除。'],
  printf:['print formatted','按格式精确输出文本。','比 `echo` 更可控，尤其适合脚本和生成配置。'],
  diff:['difference','比较两个文件之间的差异。','`diff -u old new` 用统一格式显示，`-` 是旧内容，`+` 是新内容。'],
  stat:['status','显示文件的详细元数据。','科研排错常用它判断 OUTCAR 是否仍在更新、文件是否异常为 0 字节。'],
  chmod:['change mode','修改文件权限。','例如 `chmod +x script.sh` 给脚本增加可执行权限。'],
  ps:['process status','查看进程快照。','可配合 `grep` 查找进程，但不要把 `grep` 自己误认成目标进程。'],
  top:['top','动态查看 CPU、内存和进程。','HPC 节点上是否允许使用取决于集群规则。'],
  kill:['kill','向进程发送 signal。','默认发送 TERM，请优先给程序正常退出机会；`-9` 是强制 KILL。'],
  ssh:['secure shell','登录远程主机。','科研集群最常见入口。命令在哪台机器执行必须保持清醒。'],
  scp:['secure copy','通过 SSH 复制文件。','适合简单传输；大量或断点续传场景常更适合 rsync。'],
  rsync:['remote sync','增量同步文件或目录。','适合大目录同步，但 `--delete` 等选项具有破坏性。'],
  bash:['Bourne Again Shell','启动 Bash 或用 Bash 执行脚本。','`bash script.sh` 不要求脚本本身具有可执行权限。'],
  qsub:['queue submit','向 PBS 调度系统提交作业。','返回的 job ID 才是后续 `qstat` / `qdel` 最可靠的作业标识。'],
  qstat:['queue status','查看 PBS 作业状态。','`qstat -f JOBID` 显示详细信息，例如 `job_state` 和 `PBS_O_WORKDIR`。'],
  qdel:['queue delete','请求 PBS 删除/终止作业。','它操作的是调度器作业；与 Ctrl+C 停掉本地 `tail -f` 完全不是一回事。'],
  hostname:['host name','显示当前主机名。','SSH 多层跳转后用它确认自己在哪台机器。'],
  exit:['exit','退出当前 shell/SSH 会话。','不会等价于删除 PBS 中仍在运行的作业。']
};

const optionGlossary = {
  '-l':['选项 -l','在 `wc` 中表示 lines；在 `ls` 中表示 long listing。具体意义取决于前面的命令。','如果前面是 `wc`，它统计行数。小写 `l` 很容易和数字 `1` 混淆。'],
  '-n':['选项 -n','常表示 number/count，但具体由命令定义。','在 `tail -n 30` 中指定 30 行；在 `grep -n` 中显示匹配行的行号；在 `sed -n` 中关闭默认打印。'],
  '-f':['选项 -f','具体含义依命令而变。','`tail -f` 是 follow；`find -type f` 中的 `f` 是 regular file；`rm -f` 是 force。'],
  '-i':['选项 -i','具体含义依命令而变。','`grep -i` 忽略大小写；`sed -i` 是 in-place 直接修改文件。'],
  '-E':['extended regular expressions','让 `grep` 使用扩展正则表达式。','最常见用途是让 `A|B|C` 表示多个候选模式。'],
  '-v':['invert match','反选不匹配的行。','`grep -v pattern file` 保留不含该模式的行。'],
  '-c':['count','统计匹配数量。','`grep -c PATTERN FILE` 输出匹配行数，而不是打印每个匹配行。'],
  '-p':['preserve','在 `cp -p` 中尽量保留源文件属性。','科研归档时有助于保留原始修改时间和权限信息。'],
  '-r':['recursive','递归处理目录树。','`rm -r` 会进入目录逐层删除；破坏性很强。'],
  '-a':['all','常表示包括隐藏项。','例如 `ls -a` 会显示以 `.` 开头的隐藏文件。'],
  '-h':['human-readable','把文件大小显示成 K/M/G 等易读形式。','例如 `ls -lh WAVECAR`。'],
  '-u':['unified diff','在 `diff -u` 中使用统一差异格式。','特别适合检查 INCAR 修改到底改了哪几行。']
};

const operatorGlossary = {
  '|':['pipe，管道','把左侧命令的标准输出作为右侧命令的标准输入。','数据从左往右流动，顺序不能随便交换。'],
  '>':['stdout overwrite redirection','把标准输出写入文件，并覆盖该文件原有内容。','与 `>>` 不同，`>` 可能把已有结果直接覆盖。'],
  '>>':['stdout append redirection','把标准输出追加到文件末尾。','不会主动清空原文件。'],
  '2>':['stderr redirection','把文件描述符 2，也就是标准错误，重定向到文件。','正常输出 stdout 仍走原来的去向。'],
  '2>>':['stderr append redirection','把标准错误追加到文件末尾。','适合持续累计错误日志。'],
  '2>&1':['stderr → stdout','让标准错误 2 去到标准输出 1 当前所在的位置。','`> log 2>&1` 会把正常输出和错误输出都写入 log。'],
  '&&':['AND list','只有左侧命令成功（退出码 0）才执行右侧命令。','适合“先检查成功，再继续下一步”。'],
  '||':['OR list','左侧命令失败（退出码非 0）时才执行右侧命令。','常用于失败兜底。'],
  ';':['command separator','无论前一个命令成功还是失败，都继续执行下一个。','与 `&&` 的条件执行不同。'],
  '&':['background operator','把命令放到当前 shell 的后台运行。','退出 SSH 后是否继续存活还取决于作业/会话环境。']
};

function part(token, meaning, detail, example='') { return {token, meaning, detail, example}; }

function commandPart(token){
  const g=commandGlossary[token];
  return g ? part(token,g[0],g[1]+' '+g[2],`例如：${token} ...`) : part(token,'命令 / 可执行程序','Shell 会尝试在 PATH 或给定路径中找到并运行它。这个名称不在内置教学词典中，需要结合题目上下文理解。');
}

function optionPart(token, command=''){
  if(command==='wc' && token==='-l') return part('-l','lines（行）','告诉 `wc` 只统计输入的行数。这里是小写字母 `l`（line），不是数字 `1`。','例如：wc -l OUTCAR');
  if(command==='find' && token==='-type f') return part('-type f','type = 类型；f = regular file','把 `find` 的结果限制为普通文件，不包含目录。','例如：find . -type f');
  if(command==='tail' && /^-n\s+\d+$/.test(token)) return part(token,'number of lines','指定 `tail` 要显示的行数。','例如：tail -n 30 OSZICAR');
  if(command==='head' && /^-n\s+\d+$/.test(token)) return part(token,'number of lines','指定 `head` 要显示的行数。','例如：head -n 20 OUTCAR');
  if(command==='find' && /^-maxdepth\s+\d+$/.test(token)) return part(token,'maximum depth','限制 `find` 最多向下搜索多少层目录。','例如：find . -maxdepth 3 -type d');
  if(command==='find' && /^-name\s+/.test(token)) return part(token,'name pattern','按照文件名模式过滤 `find` 的结果。','例如：find . -name OUTCAR');
  if(command==='cut' && /^-d.+/.test(token)) return part(token,'delimiter','指定字段分隔符。','例如：cut -d: -f1');
  if(command==='cut' && /^-f\d+/.test(token)) return part(token,'field','选择第几个字段。','例如：cut -d: -f1');
  if(/^-[A-Za-z]{2,}$/.test(token)){
    const flags=token.slice(1).split('');
    const details=flags.map(f=>{
      const key='-'+f; const g=optionGlossary[key]; return g?`${key}: ${g[1]}`:`${key}: 该选项含义由 ${command||'当前命令'} 定义`;
    }).join('；');
    return part(token,'组合短选项',`把多个单字母选项写在一起。${details}。`);
  }
  const g=optionGlossary[token];
  return g ? part(token,g[0],g[1]+' '+g[2]) : part(token,'命令选项','以 `-` 开头的 token 通常是选项，用来改变前一个命令的行为；具体意义必须查该命令的定义。');
}

function wordPart(token, context=''){
  const clean=token.replace(/^['"]|['"]$/g,'');
  if(clean==='.') return part('.','current directory（当前目录）','这里把当前目录作为命令的起点或操作对象。','例如：find . -type f');
  if(clean==='..') return part('..','parent directory（上一级目录）','表示当前目录的父目录。','例如：cd ..');
  if(clean==='~') return part('~','home directory（家目录）','Shell 会展开成当前用户的家目录。','例如：cd ~');
  if(clean==='/dev/null') return part('/dev/null','空设备 / 黑洞','写进去的数据会被丢弃，常用于隐藏不需要的输出。','例如：command 2>/dev/null');
  if(/^\$[A-Za-z_][A-Za-z0-9_]*$/.test(clean)) return part(clean,'变量展开','读取这个 Shell 变量当前保存的值。','例如：echo "$HOME"');
  if(/^[A-Z][A-Z0-9_.-]*$/.test(clean) || /\.(txt|log|dat|sh|pbs)$/i.test(clean)) return part(clean,'文件名 / 文本参数','这是传给前一个命令的操作对象或参数。要结合该命令判断它是输入文件、输出文件还是搜索模式。');
  if(/^['"].*['"]$/.test(token)) return part(token,'quoted string（带引号字符串）','引号把内部空格或特殊字符作为一个整体传给命令。');
  if(/^\d+$/.test(clean)) return part(clean,'数字参数','为前一个选项或命令提供数量、编号或数值。');
  return part(token,'参数 / 操作对象',`这个 token 会作为参数传给 ${context||'前面的命令'}；具体作用由该命令的位置和语法决定。`);
}

function tokenizeSimple(s){
  return s.match(/2>&1|2>>|>>|2>|&&|\|\||[|;>&]|"[^"]*"|'[^']*'|[^\s|;>&]+/g) || [];
}

function explainSequence(command){
  const raw=tokenizeSimple(command);
  const parts=[]; let currentCommand='';
  for(let i=0;i<raw.length;i++){
    let tok=raw[i];
    if(operatorGlossary[tok]){const g=operatorGlossary[tok];parts.push(part(tok,g[0],g[1]+' '+g[2]));currentCommand='';continue;}
    if(!currentCommand && !tok.startsWith('-')){currentCommand=tok;parts.push(commandPart(tok));continue;}
    if(tok==='-type' && raw[i+1]){const combined=`-type ${raw[++i]}`;parts.push(optionPart(combined,currentCommand));continue;}
    if((tok==='-n' || tok==='-maxdepth' || tok==='-name') && raw[i+1] && !operatorGlossary[raw[i+1]]){const combined=`${tok} ${raw[++i]}`;parts.push(optionPart(combined,currentCommand));continue;}
    if(tok.startsWith('-')){parts.push(optionPart(tok,currentCommand));continue;}
    parts.push(wordPart(tok,currentCommand));
  }
  return parts;
}

function buildFlow(command, parts){
  const flow=[];
  if(/\bfind\b/.test(command)) flow.push('`find` 先从指定目录开始搜索，并按条件产生一行一条的路径结果。');
  if(/\|/.test(command)) flow.push('管道 `|` 把左侧产生的文本直接交给右侧命令，不需要中间文件。');
  if(/\bwc\s+-l\b/.test(command)) flow.push('`wc -l` 统计收到多少行，因此当上一步“一行代表一个文件”时，行数就是文件数量。');
  if(/\bgrep\b/.test(command)) flow.push('`grep` 从输入文件或上游文本中筛出符合模式的行。');
  if(/\btail\b/.test(command)) flow.push('`tail` 再从当前文本结果中取末尾指定数量的行。');
  if(/(^|\s)>(?!=)/.test(command)) flow.push('最后 `>` 把标准输出覆盖写入目标文件。');
  if(/>>/.test(command)) flow.push('最后 `>>` 把标准输出追加到目标文件末尾。');
  if(/^\s*[A-Za-z_][A-Za-z0-9_]*=\$\(/.test(command)) flow.push('最外层 `$()` 先执行括号中的整条命令，再把输出赋给左侧变量。');
  if(!flow.length) flow.push('Shell 从左到右解析命令名、选项和参数，然后按照运算符与重定向规则连接各步骤。');
  return flow;
}

export function explainShellCommand(command=''){
  const trimmed=command.trim();
  const parts=[];
  let inner=trimmed;
  const assign=trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=\$\((.*)\)$/s);
  if(assign){
    parts.push(part(`${assign[1]}=`,'variable assignment（变量赋值）',`把右侧得到的最终结果保存到变量 \`${assign[1]}\` 中。之后可用 \`$${assign[1]}\` 读取。`));
    parts.push(part('$(...)','command substitution（命令替换）','先执行括号里面的命令，再把它的标准输出替换到当前位置。在这里，它让命令结果成为变量值。'));
    inner=assign[2].trim();
  }
  parts.push(...explainSequence(inner));
  const confusions=[];
  if(/\bwc\s+-l\b/.test(trimmed)) confusions.push('`wc -l` 中是小写字母 `l`（line），不是数字 `1`，也不是大写 `I`。');
  if(/\bgrep\b/.test(trimmed) && /-[A-Za-z]*[iIl1][A-Za-z]*/.test(trimmed)) confusions.push('终端里 `i / l / I / 1` 很容易看混，输入选项时按英文含义确认字符。');
  if(trimmed.includes('>') && !trimmed.includes('>>')) confusions.push('`>` 会覆盖目标文件；如果你的意图是追加内容，应使用 `>>`。');
  const remember=/\bwc\s+-l\b/.test(trimmed)
    ? '记住：`wc` = word count；`wc -l` = 统计行数。看到 `-l` 就联想到 line。'
    : `先读“命令 → 选项 → 参数 → 管道/重定向”的数据流，不要把整条命令当作一串需要死背的字符。`;
  return {parts,flow:buildFlow(trimmed,parts),remember,confusions};
}
