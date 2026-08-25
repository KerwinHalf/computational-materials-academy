export const sources = {
  vasp_tutorials:{type:'VASP Tutorials',title:'VASP Tutorials — Basic terminal commands',url:'https://vasp.at/tutorials/latest/'},
  chester:{type:'VASP Wiki workshop',title:'Chester 2019 — running VASP on PBS/HPC resources',url:'https://vasp.at/wiki/Chester_2019'},
  output_files:{type:'VASP Wiki',title:'Output files',url:'https://vasp.at/wiki/Output_files'},
  output:{type:'VASP Wiki',title:'Output',url:'https://vasp.at/wiki/Output'},
  outcar:{type:'VASP Wiki',title:'OUTCAR',url:'https://vasp.at/wiki/OUTCAR'},
  chgcar:{type:'VASP Wiki',title:'CHGCAR',url:'https://vasp.at/wiki/CHGCAR'},
  restart:{type:'VASP Wiki',title:'Restart and output files cheat sheet',url:'https://vasp.at/wiki/Restart_and_output_files_cheat_sheet'},
  band:{type:'VASP Wiki',title:'Band-structure calculation using DFT',url:'https://vasp.at/wiki/Band-structure_calculation_using_DFT'},
  lmaxmix:{type:'VASP Wiki',title:'LMAXMIX',url:'https://vasp.at/wiki/LMAXMIX'},
  forum:{type:'VASP Forum case',title:'Representative VASP Forum troubleshooting patterns',url:'https://vasp.at/forum/'}
};

const defs = [
['终端心智模型与命令结构','Shell 是“命令解释器”：你输入命令，Shell 解析命令名、选项、参数，再启动程序。理解“命令 + 选项 + 操作数”是后面所有语法的地基。','command [options] [operands]',['pwd','ls -la','man grep'],'把整行当成魔法字符串背诵，导致稍改文件名就不会用。','每敲一条命令都先口头拆成：谁在做、怎么做、对谁做。','先读懂命令，再记命令。'],
['路径、pwd 与 cd','路径描述文件系统中的位置。绝对路径从 / 开始；相对路径从当前目录出发。`.` 是当前目录，`..` 是父目录，`~` 是家目录。','pwd ; cd PATH',['pwd','cd ..','cd ~/project'],'把远程服务器路径和本机路径混在一起。','提交任务前先 pwd，排错时先确认自己到底在哪个目录。','路径错误能让完全正确的 VASP 输入变成“算错地方”。'],
['ls、隐藏文件与通配符','`ls` 查看目录；`-l` 看详细信息，`-a` 包含隐藏文件。`*`、`?` 是 Shell glob，不是正则表达式。','ls [-lah] [pattern]',['ls -la','ls *.pbs','ls -lh CHGCAR WAVECAR'],'把 `*` 当成无害符号，尤其和 rm 连用。','涉及批量操作时，先用 ls 展开同一个 glob 看一遍。','先看见要操作的对象，再操作。'],
['文件与目录操作','`touch` 创建空文件/更新时间；`mkdir` 建目录；`cp` 复制；`mv` 移动或重命名；`rm` 删除。`cp -p` 可保留时间戳等属性。','cp [options] SRC... DEST ; mv SRC DEST',['mkdir -p failed_archive','cp -p INCAR OUTCAR backup/','mv failed_run failed_archive/'],'把 mv 当复制，或者在没确认路径时使用 rm -rf。','科研归档优先 cp/mv，删除永远放在最后。','文件操作的关键不是会敲，而是能预判结果。'],
['查看文本：cat/less/head/tail','小文件可 cat，大文件优先 less；head/tail 看开头/结尾；`tail -f` 持续追踪追加内容。','tail [-n N] FILE ; less FILE',['head -n 20 OUTCAR','tail -n 30 OSZICAR','tail -f OSZICAR'],'用 cat 打开几 GB 日志，把终端淹没。','先看文件大小，再决定 cat/less/head/tail。','大型科学日志要“切片读”，不要滚轮考古。'],
['重定向与文件描述符','Shell 默认有 stdin=0、stdout=1、stderr=2。`>` 覆盖 stdout，`>>` 追加，`2>` 重定向 stderr，`2>&1` 把 stderr 合并到 stdout。','cmd > out 2>&1',['echo hello > a.txt','echo world >> a.txt','vasp_std > vasp.log 2>&1'],'把 `>` 和 `>>` 混淆，覆盖掉唯一日志。','重定向前先问：我要覆盖还是追加？','理解 0/1/2 后，PBS 日志就不再神秘。'],
['管道 |','管道把前一个程序的标准输出连接到后一个程序的标准输入。它体现 Unix 的核心思想：小工具组合解决复杂问题。','cmd1 | cmd2 | cmd3',['grep "E-fermi" OUTCAR | tail -1','find . -type d | sort','qstat | grep zd'],'误以为管道会修改前面的文件。','把复杂需求拆成“筛选 → 再筛选 → 格式化”。','会管道，才真正开始会 Shell。'],
['grep 文本搜索','grep 按行搜索文本；`-n` 行号、`-i` 忽略大小写、`-E` 扩展正则、`-v` 反选、`-c` 计数。','grep [flags] PATTERN FILE',['grep -n "E-fermi" OUTCAR','grep -niE "ERROR|ZHEGV|BRMIX" OUTCAR','grep -c "Sub-Space-Matrix is not hermitian" vasp.log'],'把正则中的 | 忘记配合 -E，或者把 pattern/file 顺序写反。','排错先 grep 证据，再提出原因。','grep 是科研日志的显微镜。'],
['sed 文本编辑','sed 擅长按行筛选和替换。`-n` 配合 p 输出指定范围；`s/old/new/` 替换；`-i` 会原地改文件。','sed -n \'A,Bp\' FILE ; sed -i \'s/old/new/\' FILE',['sed -n \'100,150p\' OUTCAR','sed \'s/Normal/All/\' INCAR','sed -i \'s/ALGO = Normal/ALGO = All/\' INCAR'],'没备份就用 -i 修改唯一 INCAR。','先不带 -i 预览，再 diff，再真正修改。','sed 很强，所以更需要证据链。'],
['awk 字段与数据提取','awk 以“记录/字段”理解文本，默认按空白分列。`$1` 是第一列，`NR` 行号，`NF` 字段数。','awk \'pattern { action }\' FILE',['awk \'{print $1}\' data.txt','awk \'/E-fermi/ {print $3}\' OUTCAR','awk \'BEGIN{s=0}{s+=$1}END{print s}\' vals.txt'],'把 Shell 的 $1 和 awk 的 $1 混为一谈。','先打印整行与字段编号，再写提取表达式。','awk 是把日志变成数据表的桥梁。'],
['cut/sort/uniq/tr/paste','这些是轻量文本加工工具：切列、排序、去重、字符转换、横向拼接。','cut -d: -f1 ; sort | uniq -c',['cut -d: -f1 lines.txt','sort names.txt | uniq','tr \'a-z\' \'A-Z\' < names.txt'],'忘记 uniq 只合并相邻重复项，通常应先 sort。','能用小工具解决就别急着写 Python。','组合小工具往往比手工 Excel 更可复现。'],
['find 与 xargs','find 按路径、类型、名字、深度、时间、大小查找。`-exec`/xargs 可批量执行，但必须警惕空格与危险删除。','find ROOT [tests] [actions]',['find . -maxdepth 3 -type d','find . -name OUTCAR -type f','find . -type f -name \'*.log\' -size +1G'],'把 find 的搜索结果直接接 rm，没有先预览。','先纯 find，确认结果，再考虑 -exec。','find 是目录树上的查询语言。'],
['变量、引用与环境变量','`$VAR` 取变量值，`${VAR}` 明确边界，export 让子进程继承。单引号抑制展开，双引号允许变量展开。','VAR=value ; echo "$VAR" ; export VAR',['name=VS2','echo "$name"','export VASP=/path/to/vasp_std'],'路径变量不加引号，遇到空格就碎裂。','变量用于表达意图，不只是偷懒。','脚本可读性来自清晰变量名和正确引用。'],
['命令替换与算术展开','`$(cmd)` 把命令输出嵌入当前命令；`$((...))` 做整数算术；`$?` 是上一命令退出码。','x=$(cmd) ; n=$((n+1))',['here=$(pwd)','line=$(grep -n "E-fermi" OUTCAR | tail -1 | cut -d: -f1)','next=$((line+14))'],'把 `$(...)` 和 `$((...))` 混淆。','遇到复杂嵌套先把内部命令单独运行。','让 Shell 把“查到的结果”继续用于下一步。'],
['&&、||、; 与 test','`;` 无条件继续；`&&` 前一步成功才继续；`||` 前一步失败才继续。`[ ]`/test 用于条件判断。','cmd1 && cmd2 ; test EXPR',['mkdir backup && cp INCAR backup/','grep -q "EDIFF is reached" OUTCAR && echo converged','[ -f CHGCAR ] && echo yes'],'把 `;` 当成 `&&`，前面失败后仍继续危险操作。','有依赖关系的步骤用 && 表达。','退出状态是 Shell 控制流的骨架。'],
['循环：for/while','循环适合遍历材料、U 值、目录。for 常配 glob；while 常配读取流。','for x in ...; do ...; done',['for d in U*; do echo "$d"; done','for d in */; do grep "E-fermi" "$d/OUTCAR"; done','while read x; do echo "$x"; done < list.txt'],'变量未加双引号，路径含空格时出错。','先 echo 目标路径做 dry run，再替换成真实命令。','批处理的第一原则是可预览。'],
['Shell 函数','函数把重复逻辑封装成有名字的操作，可接收位置参数。','name(){ commands; }',['check(){ grep -q "EDIFF is reached" "$1/OUTCAR"; }','backup(){ cp -p "$1" "$1.bak"; }','showgap(){ grep "E-fermi" "$1/OUTCAR" | tail -1; }'],'函数里硬编码当前目录，换项目立即失效。','函数参数化，并对输入文件存在性做检查。','重复三次的命令就值得考虑函数化。'],
['权限与 chmod','r/w/x 分别是读写执行。chmod 可用符号式或数字式。脚本需要执行权限才能 `./script.sh`。','chmod u+x script.sh',['ls -l batch_submit.sh','chmod u+x batch_submit.sh','chmod 755 run.sh'],'看到 Permission denied 就盲目 chmod 777。','只给需要的权限，不把 777 当万能药。','权限是安全边界，不是障碍。'],
['进程、信号与后台','ps/top 查看进程，kill 发送信号。`&` 后台运行；jobs/fg/bg 管理当前 Shell 作业。PBS 作业不等同于本地前台进程。','ps aux ; kill PID ; cmd &',['ps -ef | grep vasp','jobs','kill 12345'],'Ctrl+C 停掉 tail 后误以为 PBS 作业也停了。','区分“查看程序”“本地进程”“调度器作业”三个层级。','终端退出不等于集群作业结束。'],
['SSH 与远程 HPC','SSH 建立远程 Shell。scp/rsync 用于复制数据；远程路径和本机路径是两套文件系统。','ssh host ; scp SRC host:DEST',['ssh user@cluster','scp INCAR user@cluster:/path/run/','rsync -av results/ user@host:/backup/'],'在服务器路径前误写本机盘符，或反之。','任何传输前先确认“源在哪台机器、目标在哪台机器”。','远程科研首先是路径与身份管理。'],
['Shell 脚本','脚本把命令固化成可复现流程。shebang 指明解释器；$1/$@ 接收参数；`set -euo pipefail` 可提高严格性，但需理解副作用。','#!/usr/bin/env bash',['#!/usr/bin/env bash','echo "$1"','for x in "$@"; do echo "$x"; done'],'复制脚本却不读变量和路径，导致在错误目录批量操作。','先读脚本，再 dry run，再执行。','脚本是“可复现实验步骤”，不是黑箱按钮。'],
['PBS/HPC 基础','qsub 提交，qstat 查看，qstat -f 看详细信息，qdel 删除作业。`PBS_O_WORKDIR` 是提交目录，job ID 比 job name 更可靠。','qsub job.pbs ; qstat -f JOBID',['qsub zd.pbs','qstat','qstat -f 263460 | grep PBS_O_WORKDIR'],'多个作业同名后只看名称判断身份。','排错作业先确认 job ID、状态、提交目录。','调度器管理的是作业对象，不是终端窗口。'],
['科研目录卫生与溯源','计算可复现不仅靠输入，还靠清晰目录、时间戳、归档和 diff。失败结果也有诊断价值。','mkdir archive ; cp -p ; stat ; diff -u',['mkdir -p failed_archive','stat -c \'%y %s %n\' OUTCAR','diff -u INCAR.old INCAR'],'把失败文件随手覆盖，失去“为什么失败”的证据。','每次关键参数修改都保留母版和 diff。','好目录结构能减少一半排错时间。'],
['VASP 文件识读','OUTCAR 是主要详细输出；OSZICAR 便于监控电子/离子步；CHGCAR 可用于电荷密度重启；WAVECAR 保存波函数；CONTCAR 是结束结构。','grep / tail / ls -lh around VASP files',['ls -lh OUTCAR OSZICAR CHGCAR WAVECAR','tail -n 20 OSZICAR','grep -n "E-fermi" OUTCAR | tail -1'],'把 CHG 和 CHGCAR、POSCAR 和 CONTCAR 的作用混淆。','判断文件能不能继承，先问它保存的物理量是什么。','文件名背后是“状态”，不是附件列表。'],
['用 Shell 监控 VASP','监控不是盯着终端发呆，而是提取收敛、能量、报错和正常结束证据。','tail / grep / wc',['tail -f OSZICAR','grep -n "General timing and accounting informations" OUTCAR','grep -niE "ERROR|ZHEGV|BRMIX|killed" OUTCAR vasp.log'],'只看到任务还在 R 就认为计算健康。','同时看调度状态、日志更新、数值收敛和错误关键词。','“还在跑”和“值得继续跑”是两回事。'],
['重启与能带工作流','VASP 官方推荐可从 CHGCAR/WAVECAR 重启；标准 DFT 能带常先做 SCF，再复制 CHGCAR 到 band 目录，用 ICHARG=11 固定电荷。','cp SCF files -> band ; edit INCAR/KPOINTS',['mkdir -p band','cp INCAR POSCAR POTCAR CHGCAR band/','grep "LMAXMIX" INCAR'],'随意把旧 WAVECAR 带入已大改 k 网格/设置的任务。','重启文件必须和当前物理设置兼容；不确定时从 CHGCAR 比从波函数更稳妥。','继承是加速手段，不是仪式。'],
['VASP 错误分诊','看到 EDDDAV/ZHEGV/BRMIX/non-hermitian/BAD TERMINATION/killed 时，先分类：数值算法、输入/重启不兼容、资源/调度，不能只靠一个关键词诊断。','grep -niE + counts + file sizes',['grep -niE "EDDDAV|ZHEGV|BRMIX|ERROR" OUTCAR vasp.log','grep -c "Sub-Space-Matrix is not hermitian" vasp.log','ls -lh vasp.log WAVECAR CHGCAR'],'看到某个错误名就直接照论坛复制参数。','先收集上下文：版本、输入、最后几十步、文件大小、是否正常结束。','错误关键词是线索，不是根因。'],
['批量科研自动化','批量任务的价值是减少重复劳动，但风险也被放大。循环 + grep/awk 能自动抽取结果。','for ...; do ...; done',['for d in U*/; do echo "$d"; grep "E-fermi" "$d/OUTCAR" | tail -1; done','find . -name OUTCAR -type f | sort','for d in */; do [ -f "$d/OUTCAR" ] && grep -H "E-fermi" "$d/OUTCAR" | tail -1; done'],'未经 dry run 的循环里放 mv/rm。','先只 echo 路径；第二遍读数据；第三遍才考虑写操作。','自动化的核心是把风险也自动化控制。'],
['VS2 实战实验室','把前面语法放回真实 VS2/Wannier/VASP 排错：确认工作目录、归档 probe、比较 INCAR、定位 E-fermi、统计 non-hermitian 警告、确认 PBS 工作目录。','组合 grep/diff/stat/qstat/sed',['diff -u INCAR.before INCAR','qstat -f 263460 | tr \',\' \'\\n\' | grep PBS_O_WORKDIR','stat -c \'%y %s %n\' OSZICAR'],'把复杂命令完整复制却不知道每个管道在做什么。','每条复杂命令先拆成两到三条单命令验证。','最终目标是你能自己设计排错命令，而不是记住我的命令。'],
['安全与恢复','Shell 没有回收站保证。危险来自 rm、通配符、覆盖重定向、错误变量和错误目录。恢复能力来自备份、版本化、dry run、最小权限。','preview -> verify -> act',['pwd && ls','cp -p INCAR INCAR.bak','echo rm -r failed_run'],'把 `rm -rf *` 当清理命令。','真正删除前至少确认 pwd、目标列表和备份。','速度不如可恢复性重要。']
];

export const chapters = defs.map((d,i)=>({id:i+1,title:d[0],concept:d[1],anatomy:d[2],examples:d[3],mistake:d[4],habit:d[5],recap:d[6]}));

const exerciseBank = {
1:[['显示当前工作目录。','pwd'],['查看 grep 的手册。','man grep'],['列出当前目录详细信息。','ls -l'],['执行名为 run.sh 的 Bash 脚本。','bash run.sh'],['查看 ls 的帮助信息。','ls --help'],['打印一行文字 hello。','echo hello']],
2:[['进入父目录。','cd ..'],['回到家目录。','cd ~'],['进入当前目录下 static。','cd static'],['显示当前绝对路径。','pwd'],['进入绝对路径 /share1/home。','cd /share1/home'],['进入上两级目录。','cd ../..']],
3:[['列出隐藏文件和详细信息。','ls -la'],['列出所有 .pbs 文件。','ls *.pbs'],['以易读单位查看 CHGCAR 和 WAVECAR 大小。','ls -lh CHGCAR WAVECAR'],['列出以 INCAR 开头的文件。','ls INCAR*'],['列出单字符后缀的 run 文件，如 run1/run2。','ls run?'],['只显示隐藏项也可接受普通全量查看。','ls -a']],
4:[['创建 failed_archive 目录（存在也不报错）。','mkdir -p failed_archive'],['把 failed_run 整个目录移动到 failed_archive/。','mv failed_run failed_archive/'],['复制 INCAR 到 INCAR.bak。','cp INCAR INCAR.bak'],['保留属性复制 INCAR、OUTCAR、OSZICAR 到 backup/。','cp -p INCAR OUTCAR OSZICAR backup/'],['创建空文件 note.txt。','touch note.txt'],['删除空目录 old_empty。','rmdir old_empty']],
5:[['查看 OSZICAR 最后 30 行。','tail -n 30 OSZICAR'],['持续跟踪 OSZICAR。','tail -f OSZICAR'],['查看 OUTCAR 前 20 行。','head -n 20 OUTCAR'],['分页查看大文件 OUTCAR。','less OUTCAR'],['显示小文件 INCAR 全部内容。','cat INCAR'],['统计 OUTCAR 行数。','wc -l OUTCAR']],
6:[['把 hello 覆盖写入 a.txt。','echo hello > a.txt'],['把 world 追加到 a.txt。','echo world >> a.txt'],['把 command 的错误输出丢弃。','command 2>/dev/null'],['把 command 正常和错误输出都写到 run.log。','command > run.log 2>&1'],['把 errors 追加到 err.log。','command 2>> err.log'],['把 input.txt 作为 sort 的标准输入。','sort < input.txt']],
7:[['在 OUTCAR 中找 E-fermi 并只保留最后一次。','grep "E-fermi" OUTCAR | tail -1'],['列出三层以内目录并排序。','find . -maxdepth 3 -type d | sort'],['从 qstat 输出筛选 zd。','qstat | grep zd'],['统计 ERROR 行数。','grep "ERROR" OUTCAR | wc -l'],['取包含 DAV 的行再看最后 10 行。','grep "DAV" OSZICAR | tail -n 10'],['从 names.txt 排序并去重。','sort names.txt | uniq']],
8:[['在 OUTCAR 中查 E-fermi 并显示行号。','grep -n "E-fermi" OUTCAR'],['忽略大小写搜索 error。','grep -i "error" OUTCAR'],['同时搜索 ERROR、ZHEGV、BRMIX，显示行号并忽略大小写。','grep -niE "ERROR|ZHEGV|BRMIX" OUTCAR'],['统计 non-hermitian 警告次数。','grep -c "Sub-Space-Matrix is not hermitian" vasp.log'],['排除包含 WARNING 的行。','grep -v "WARNING" OUTCAR'],['递归搜索当前目录里的 E-fermi。','grep -R "E-fermi" .']],
9:[['打印 OUTCAR 第100到150行。','sed -n \'100,150p\' OUTCAR'],['预览把 Normal 换成 All。','sed \'s/Normal/All/\' INCAR'],['原地把 ALGO = Normal 改成 ALGO = All。','sed -i \'s/ALGO = Normal/ALGO = All/\' INCAR'],['打印 INCAR 第1到20行。','sed -n \'1,20p\' INCAR'],['只打印第42行。','sed -n \'42p\' OUTCAR'],['删除空行并输出结果。','sed \'/^$/d\' INCAR']],
10:[['打印 data.txt 第一列。','awk \'{print $1}\' data.txt'],['打印每行字段数。','awk \'{print NF}\' data.txt'],['给每行加行号。','awk \'{print NR,$0}\' data.txt'],['从包含 E-fermi 的行打印第三列。','awk \'/E-fermi/ {print $3}\' OUTCAR'],['求 vals.txt 第一列总和。','awk \'{s+=$1} END{print s}\' vals.txt'],['只打印字段数大于3的行。','awk \'NF>3 {print}\' data.txt']],
11:[['按冒号切 lines.txt 并取第一列。','cut -d: -f1 lines.txt'],['排序 names.txt。','sort names.txt'],['排序后去重 names.txt。','sort names.txt | uniq'],['把小写转大写。','tr \'a-z\' \'A-Z\' < names.txt'],['横向拼接 a.txt 和 b.txt。','paste a.txt b.txt'],['统计排序后每个名字出现次数。','sort names.txt | uniq -c']],
12:[['列出当前目录三层以内的所有目录。','find . -maxdepth 3 -type d'],['寻找所有 OUTCAR 文件。','find . -type f -name OUTCAR'],['寻找大于1G的 .log 文件。','find . -type f -name \'*.log\' -size +1G'],['寻找最近1天修改的文件。','find . -type f -mtime -1'],['寻找名为 failed_archive 的目录。','find . -type d -name failed_archive'],['寻找所有 .pbs 并排序。','find . -type f -name \'*.pbs\' | sort']],
13:[['设置变量 name 为 VS2。','name=VS2'],['输出变量 name。','echo "$name"'],['把 VASP 路径设为环境变量。','export VASP=/path/to/vasp_std'],['输出 HOME。','echo "$HOME"'],['用花括号拼接变量 name 和 _static。','echo "${name}_static"'],['把当前目录保存为 here。','here=$(pwd)']],
14:[['把 pwd 输出保存进 here。','here=$(pwd)'],['把 2+3 计算后保存进 n。','n=$((2+3))'],['打印上一条命令退出状态。','echo $?'],['把最后一次 E-fermi 行号保存到 line。','line=$(grep -n "E-fermi" OUTCAR | tail -1 | cut -d: -f1)'],['计算 line+14。','echo $((line+14))'],['把文件数保存到 n。','n=$(find . -type f | wc -l)']],
15:[['只有 mkdir 成功才复制 INCAR。','mkdir backup && cp INCAR backup/'],['grep 失败时打印 notfound。','grep -q "foo" file || echo notfound'],['无论前一步成功与否都执行 pwd。','false; pwd'],['CHGCAR 存在时打印 yes。','[ -f CHGCAR ] && echo yes'],['目录 band 存在时打印 yes。','[ -d band ] && echo yes'],['INCAR 不为空时打印 yes。','[ -s INCAR ] && echo yes']],
16:[['遍历 U* 目录并打印名字。','for d in U*; do echo "$d"; done'],['遍历所有子目录并打印名字。','for d in */; do echo "$d"; done'],['遍历 1 2 3 并打印。','for x in 1 2 3; do echo "$x"; done'],['逐行读取 list.txt 并打印。','while read x; do echo "$x"; done < list.txt'],['遍历所有子目录并查 E-fermi。','for d in */; do grep "E-fermi" "$d/OUTCAR"; done'],['遍历 U* 仅做 dry run 打印路径。','for d in U*; do echo "$d/OUTCAR"; done']],
17:[['定义 hi 函数打印 hello。','hi(){ echo hello; }'],['调用 hi。','hi'],['定义 show 函数打印第一个参数。','show(){ echo "$1"; }'],['定义 backup 函数复制参数文件到 .bak。','backup(){ cp -p "$1" "$1.bak"; }'],['定义 here 函数执行 pwd。','here(){ pwd; }'],['定义 hasfile 函数测试参数文件存在。','hasfile(){ [ -f "$1" ]; }']],
18:[['给 run.sh 的用户增加执行权限。','chmod u+x run.sh'],['查看 run.sh 权限。','ls -l run.sh'],['把 run.sh 设为755。','chmod 755 run.sh'],['移除 group 的写权限。','chmod g-w file'],['给所有者读写权限。','chmod u+rw file'],['执行当前目录脚本。','./run.sh']],
19:[['查看所有进程并筛选 vasp。','ps -ef | grep vasp'],['列出当前 Shell 后台作业。','jobs'],['把最近后台作业拉回前台。','fg'],['给 PID 12345 发送默认终止信号。','kill 12345'],['后台运行 long.sh。','bash long.sh &'],['查看实时进程。','top']],
20:[['SSH 登录 user@cluster。','ssh user@cluster'],['复制 INCAR 到远程 /work/run/。','scp INCAR user@cluster:/work/run/'],['从远程复制 OUTCAR 到当前目录。','scp user@cluster:/work/run/OUTCAR .'],['同步 results/ 到远端 backup/。','rsync -av results/ user@cluster:/backup/'],['打印当前主机名。','hostname'],['退出 SSH 会话。','exit']],
21:[['写出常见 Bash shebang。','#!/usr/bin/env bash'],['打印脚本第一个参数。','echo "$1"'],['打印全部参数。','echo "$@"'],['启用严格模式。','set -euo pipefail'],['遍历所有参数。','for x in "$@"; do echo "$x"; done'],['运行脚本并传入 relax。','bash script.sh relax']],
22:[['提交 zd.pbs。','qsub zd.pbs'],['查看队列。','qstat'],['查看作业263460详细信息。','qstat -f 263460'],['删除作业263460。','qdel 263460'],['从作业详情里筛 PBS_O_WORKDIR。','qstat -f 263460 | grep PBS_O_WORKDIR'],['从作业详情里筛 job_state。','qstat -f 263460 | grep job_state']],
23:[['创建失败归档目录。','mkdir -p failed_archive'],['显示 OUTCAR 时间、大小和名字。','stat -c \'%y %s %n\' OUTCAR'],['比较两个 INCAR。','diff -u INCAR.old INCAR'],['保留属性备份 INCAR。','cp -p INCAR INCAR.before_change'],['把 failed_run 移进 failed_archive。','mv failed_run failed_archive/'],['显示当前路径后列目录。','pwd && ls']],
24:[['显示 VASP 关键输出文件大小。','ls -lh OUTCAR OSZICAR CHGCAR WAVECAR'],['查看 OSZICAR 最后20行。','tail -n 20 OSZICAR'],['找 OUTCAR 最后一次 E-fermi。','grep "E-fermi" OUTCAR | tail -1'],['确认 CONTCAR 存在。','ls -l CONTCAR'],['寻找 IBZKPT。','ls -l IBZKPT'],['确认 CHGCAR 非空。','[ -s CHGCAR ] && echo yes']],
25:[['实时跟踪 OSZICAR。','tail -f OSZICAR'],['检查正常结束 footer。','grep -n "General timing and accounting informations" OUTCAR'],['筛严重错误。','grep -niE "ERROR|ZHEGV|BRMIX|killed" OUTCAR vasp.log'],['统计 DAV 行。','grep -c "DAV" OSZICAR'],['显示 vasp.log 最后50行。','tail -n 50 vasp.log'],['查看 OUTCAR 是否仍在更新。','stat -c \'%y %s %n\' OUTCAR']],
26:[['创建 band 目录。','mkdir -p band'],['复制标准 band 所需四文件。','cp INCAR POSCAR POTCAR CHGCAR band/'],['检查 INCAR 中 LMAXMIX。','grep "LMAXMIX" INCAR'],['确认 CHGCAR 非空。','[ -s CHGCAR ] && echo yes'],['比较 SCF 与 band INCAR。','diff -u INCAR band/INCAR'],['查看 WAVECAR 大小。','ls -lh WAVECAR']],
27:[['同时筛 EDDDAV/ZHEGV/BRMIX/ERROR。','grep -niE "EDDDAV|ZHEGV|BRMIX|ERROR" OUTCAR vasp.log'],['统计 non-hermitian 次数。','grep -c "Sub-Space-Matrix is not hermitian" vasp.log'],['查看日志最后30行。','tail -n 30 vasp.log'],['查看 CHGCAR/WAVECAR 是否为0字节。','ls -lh CHGCAR WAVECAR'],['筛 BAD TERMINATION。','grep -ni "BAD TERMINATION" vasp.log'],['筛 killed。','grep -ni "killed" vasp.log']],
28:[['批量打印 U* 目录。','for d in U*/; do echo "$d"; done'],['批量提取各目录最后 E-fermi。','for d in U*/; do grep "E-fermi" "$d/OUTCAR" | tail -1; done'],['寻找所有 OUTCAR 并排序。','find . -name OUTCAR -type f | sort'],['仅在 OUTCAR 存在时提取 E-fermi。','for d in */; do [ -f "$d/OUTCAR" ] && grep "E-fermi" "$d/OUTCAR" | tail -1; done'],['dry run 打印将检查的 OSZICAR 路径。','for d in */; do echo "$d/OSZICAR"; done'],['统计当前树中 OUTCAR 数量。','find . -name OUTCAR -type f | wc -l']],
29:[['比较修改前后的 INCAR。','diff -u INCAR.before INCAR'],['查看作业263460提交目录。','qstat -f 263460 | grep PBS_O_WORKDIR'],['查看 OSZICAR 时间与大小。','stat -c \'%y %s %n\' OSZICAR'],['找最后一次 E-fermi。','grep -n "E-fermi" OUTCAR | tail -1'],['统计 non-hermitian 警告。','grep -c "Sub-Space-Matrix is not hermitian" vasp_static.log'],['归档当前 INCAR/OUTCAR/OSZICAR。','cp -p INCAR OUTCAR OSZICAR probe_archive/']],
30:[['删除前先显示当前路径。','pwd'],['备份 INCAR。','cp -p INCAR INCAR.bak'],['只打印准备删除 failed_run 的命令，不执行。','echo rm -r failed_run'],['确认 failed_run 是目录。','[ -d failed_run ] && echo yes'],['列出当前目录再决定操作。','ls -la'],['比较备份和当前 INCAR。','diff -u INCAR.bak INCAR']]
};

const sourceForChapter = id => id===22?'chester':id===23?'vasp_tutorials':id===24?'output_files':id===25?'outcar':id===26?'band':id===27?'forum':id===28?'forum':id===29?'forum':null;
const difficulties=['beginner','beginner','intermediate','intermediate','advanced','advanced'];
export const exercises=[];
for(const c of chapters){
  (exerciseBank[c.id]||[]).forEach((qa,j)=>{
    const answer=qa[1];
    const ex={
      id:`c${String(c.id).padStart(2,'0')}-q${j+1}`,
      chapterId:c.id,
      prompt:qa[0],
      answers:[answer],
      validator:'exactish',
      hint:`先回忆本章语法骨架：${c.anatomy}`,
      explanation:`一种正确写法是：${answer}。关键是理解命令结构，而不是死背字符串。`,
      difficulty:difficulties[j],
      sourceId:sourceForChapter(c.id)
    };
    if(c.id===5 && j===0){ex.validator='tailLines';ex.meta={file:'OSZICAR',count:30,follow:false};}
    if(c.id===8 && j===2){ex.validator='grepFlags';ex.meta={file:'OUTCAR',pattern:'ERROR|ZHEGV|BRMIX',flags:['n','i','E']};}
    if(c.id===4 && j===3){ex.validator='copyPreserve';ex.meta={sources:['INCAR','OUTCAR','OSZICAR'],dest:'backup/'};}
    exercises.push(ex);
  });
}

export const coverageAudit={
  lastReviewed:'2026-08-25',
  chapterCount:chapters.length,
  exerciseCount:exercises.length,
  claims:[
    '30 个章节均包含知识讲解、语法骨架、至少 3 个示例、常见错误、科研习惯与小结。',
    '每章至少 6 道练习，总题量不少于 180。',
    'VASP/HPC 实战章节包含 VASP 官方 Wiki / Tutorials 或 Forum 类型来源元数据。',
    '题库覆盖路径、文件、重定向、管道、grep/sed/awk、find、变量、控制流、脚本、权限、进程、SSH、PBS、VASP 日志与批处理。',
    '不声称穷尽整个 VASP Forum；覆盖的是与 Linux/Shell/HPC/VASP 工作流直接相关的主要模式。'
  ]
};
