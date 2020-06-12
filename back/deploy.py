puts = lambda x : (print("\033[1;32m",end=""), print(x), print("\033[0m",end=""))
putserr = lambda x : (print("\033[1;31m",end=""), print(x), print("\033[0m",end=""))

REMOTE_REPO_DIR = '~/secp_2020'

import paramiko, time

start = time.perf_counter()

class Client:
    def __init__(self, ip, port, username, password):
        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            self.ssh.connect(hostname=ip,port=port,username=username,password=password)
            puts("成功连接至部署服务器 %s:%s" %(SERVER_ADDR, SERVER_PORT))
        except:
            putserr("无法连接至部署服务器 %s:%s ，请检查密钥！ " %(SERVER_ADDR, SERVER_PORT))
            exit(0)

    def exec_cmd(self, cmd, silent=False, wait=True):
        _, stdout, stderr = self.ssh.exec_command(cmd)
        if wait:
            result = stdout.read()
            if not result:
                result = stderr.read()
            result = result.decode()
            if not silent:
                print(result)
            return result
        else:
            return
try:
    from key import SERVER_ADDR, SERVER_PORT, SERVER_USER, SERVER_PSWD
    from config import PRODUCTION_ENV
except:
    putserr("部署配置导入失败！请联系管理员获取 key.py 文件！")
    exit(0)

client = Client(SERVER_ADDR, SERVER_PORT, SERVER_USER, SERVER_PSWD)

puts("正在检查服务器运行状态...")
result = client.exec_cmd("curl localhost:%s/ping" % PRODUCTION_ENV['port'], silent=True)
if not result=='pong':
    putserr("服务器未启动！脚本将直接同步源代码，执行构建并启动服务器...")
else:
    puts("服务器正在运行！正在通知服务器保存数据...")
    result = client.exec_cmd("curl localhost:%s/saveall" % PRODUCTION_ENV['port'], silent=True)
    if not result=='Finished!!!':
        putserr("服务器返回了非预期的响应结果，脚本自动终止执行...")
        print(result)
        exit(0)
    else:
        puts("服务器已保存数据，正在终止服务器...")
        client.exec_cmd("sudo fuser -k -n tcp %s" % PRODUCTION_ENV['port'], silent=True)

puts("正在从Github上同步项目源代码...")
client.exec_cmd("cd " + REMOTE_REPO_DIR + " && git pull")
puts("源代码同步完成，开始对前端进行构建...")
client.exec_cmd("cd " + REMOTE_REPO_DIR + "/back && python build.py")
puts("前端构建完成，正在重新启动服务器...")
client.exec_cmd("cd " + REMOTE_REPO_DIR + "/back && nohup python -u server.py -m PRODUCTION_ENV >> " + REMOTE_REPO_DIR + "/back/server.log 2>&1 &", wait=False)

time.sleep(5)
result = client.exec_cmd("curl localhost:%s/ping" % PRODUCTION_ENV['port'], silent=True)
if not result=='pong':
    putserr("服务器响应超时！部署失败，脚本自动终止执行。")
    print(result)
    exit(0)

end = time.perf_counter()
puts("服务器成功启动！部署成功完成，本次部署耗时 %0.2f 秒。" % (end - start))
