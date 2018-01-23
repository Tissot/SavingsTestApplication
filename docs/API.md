# 储蓄实验 API 文档（APP接口完整，管理系统接口有残缺）

## 1. 标准（标准提到的部分会在接口的request中省略）

### 1. baseURL

``` ruby
1. 所有 url 前面必须带上 baseURL, baseURL 为 https://mardan.top 。
```
### 2. method（请求方法）

``` ruby
1. 所有请求方法都为 post。 
```

### 3. statusCode（响应结果状态码）

``` ruby
1. 所有状态码的类型都应为 number 而不是 string ，且只能是 100 或 101。
2. 状态码 100 意味响应结果为操作成功。 
3. 状态码 101 意味响应结果为操作失败。
```
### 4. token
``` ruby
1. 用户登录后的所有 request 都会在 header 里添加用户的 token ，包括用户登出。
```

### 5. undefined
``` ruby
1. 如数据类型为 undefined 表示不需要填写或返回。
```

### 6. null
``` ruby
1. 如数据类型为 null 表示未填写。
```

## 2. 接口

- ### 用户登录

	> #### request:
	> ``` ruby
	> url: /user/signIn,
	> data: object <
	>	mobilePhone: string,
	> 	password: string
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: enum('登录成功', string), // 其它后端补充
	> result: object <
	> 	token: string
	> >
	> ```

- ### 用户登出

	> #### request:
	> ``` ruby
	> url: /user/signOut,
	> data: undefined
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: enum('登出成功', string), // 其它后端补充
	> result: undefined
	> ```

- ### 获取在线内容列表

	> #### request:
	> ``` ruby
	> url: /onlineContent/getOnlineContents,
	> data: object <
	> 	group: enum(0, 1, 2, 3, undefined) // 管理员必填， 用户不填（根据 token 判断是管理员还是用户）。
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	onlineContents: array <
	> 		object <
	> 			_id: string,
	> 			title: string,
	> 			type: enum(0, 1),	// 0 为文档， 1 为视频。
	> 			url: string, 
	> 			group: enum(0, 1, 2, 3)	// 管理员需返回， 用户不返回。
	> 		> * n
	> 	>
	> >
	> ```

- ### 获取试题列表（后台管理系统API已实现，但需要对照下列叙述更改）

	> #### request:
	> ``` ruby
	> url: /question/getQuestions,
	> data: object > <
	> 	group: enum(0, 1, 2, 3, undefined)	// 管理员必填， 用户不填（根据 token 判断是管理员还是用户）。
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	questions: array <
	> 		object <
	> 			_id: string,
	> 			question: string,
	> 			options: array <string * 4>,
	> 			answer: enum(0, 1, 2, 3)，
	> 			group: enum(0, 1, 2, 3) // 管理员需返回， 用户不返回。
	> 		> * n
	> 	>
	> >
	> ```

- ### 获取储蓄情况类型

	> #### request:
	> ``` ruby
	> url: /savingsSituation/getSavingsSituationsTypes,
	> data: undefined
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	group: enum(0, 1, 2, 3)
	> >
	> ```

- ### 获取每月储蓄情况

	> #### request:
	> ``` ruby
	> url: /savingsSituation/getEachMonthSavingsSituations,
	> data: 
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object<
	> 	eachMonthSavingsSituations: array <enum(number, null) * 4>  // eachMonthSavingsSituations[0] 为每月支出，eachMonthSavingsSituations[1] 为每月收入，eachMonthSavingsSituations[2] 为每月建议储蓄额，eachMonthSavingsSituations[3] 为每月期望储蓄额。
	> >
	> ```

- ### 管理员／用户获取历史／子女教育历史储蓄情况（根据 token 判断为管理员还是用户）

	> #### request:
	> ``` ruby
	> url: /savingsSituation/getHistoricalSavingsSituations,
	> data: object <
	> 	savingsSituationType: enum(0, 1),	// 0 表示历史储蓄情况，1 表示子女教育历史储蓄情况。
	> 	userId: string	// token 为管理员要填，token 为用户不填。
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	historicalSavingsSituations: array <
	> 	object <
	> 		key: enum('2017', '2018', '2019', '2020', ...),
	> 		data: array <
	> 				object <
	> 					key: enum(
	> 						'一月实际储蓄额',
	> 						'二月实际储蓄额',
	> 						'三月实际储蓄额',
	> 						'四月实际储蓄额',
	> 						'五月实际储蓄额',
	> 						'六月实际储蓄额',
	> 						'七月实际储蓄额',
	> 						'八月实际储蓄额',
	> 						'九月实际储蓄额',
	> 						'十月实际储蓄额',
	> 						'十一月实际储蓄额',
	> 						'十二月实际储蓄额'
	> 					),
	> 					value: enum(number, null),	// 储蓄额。
	> 					achieveExpectation: boolean,	// 是否达成储蓄目标，比较每月期望储蓄额和 value 得到。token 为管理员且 savingsSituationType 为 0 才返回，其它情况不返回。
	> 					reason: string	// 原因。token 为管理员且 savingsSituationType 为 0 才返回，其它情况不返回。
	> 				> * n
	> 			>
	> 		> * n
	> 	>
	> >
	> ```

- ### 获取同组用户列表（后台管理系统API已实现，需要对group进行修改。）

	> #### request:
	> ``` ruby
	> url: /user/getUsers,
	> data: object <
	> 	group: enum(0, 1, 2, 3, 4), // 新增 4 返回 0， 2 组的用户，按用户创建时间排序。
	> 	startNum: number,
	> 	pageSize: number
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	users: array <
	> 		object <
	> 			_id: string,
	> 			mobilePhone: string,	// token 为管理员才返回
	> 			name: string,	// token 为管理员才返回
	> 			nickname: string,
	> 			gender: enum(0, 1),	// token 为管理员才返回
	> 			group: enum(0, 1, 2, 3),	// token 为管理员才返回
	> 			avatar: string	// token 为 2，3 组用户并且 group 为 4 才返回。
	> 		>
	> 	>
	> >
	> ```

- ### 获取单个用户的储蓄情况

	> #### request:
	> ``` ruby
	> url: /savingsSituation/getUserSavingsSituations,
	> data: object <
	> 	_id: string
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	savingsSituations: array <
	> 		enum(number, null) * 2,
	> 		enum('是', '否')
	> 	>	// result[0] 为每月期望储蓄额，result[1] 为最新实际储蓄额（最近一次值不为null的储蓄额），result[2] 为是否达成期望储蓄额。
	> >
	> ```

- ### 编辑用户储蓄情况

	> #### request:
	> ``` ruby
	> url: /savingsSituation/editSavingsSituation,
	> data: object <
	> 	savingsSituationsType: enum(0, 1, 2),	// 0 表示每月储蓄情况，1 表示历史储蓄情况，2 表示子女教育储蓄情况。
	> 	savingsSituation: savingsSituationsType === 0 && enum(
	> 		0,	// 每月支出
	> 		1,	// 每月收入
	> 		2,	// 每月期望储蓄额
	> 	) || (savingsSituationsType === 1 || savingsSituationsType === 2) && enum(
	> 		'201701',	// 以下表示指定年月的实际储蓄额，前4位表示年份，后2位表示月份。
	> 		'201702',
	> 		'201703',
	> 		...
	> 		'202012'		
	> 	),	// savingsSituation 跟 savingsSituationsType 有关，当 savingsSituationsType 为 0 时，savingsSituation 可以为 0，1，2，而当 savingsSituationsType 为 1，2 时, savingsSituation 可以为 '201701', '201702', '201703', ..., '202012'。
	> 	value: number,	// 此处需要后端验证 value 是否大于等于 0，至于是不是小数怎么方便怎么来。
	> 	reason: string	// savingsSituationsType 为 1 的时候需要填写。
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: undefined
	> ```

- ### 获取用户信息

	> #### request:
	> ``` ruby
	> url: /user/getUserInfo,
	> data: undefined
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	avatar: string,	// 头像 URL
	> 	nickname: string
	> >
	> ```

- ### 获取用户积分

	> #### request:
	> ``` ruby
	> url: /user/getUserPoints,
	> data: undefined
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	Points: number	// 积分
	> >
	> ```

- ### 获取调查问卷

	> #### request:
	> ``` ruby
	> url: /other/getSearchQuestionnaire
	> data: undefined
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	searchQuestionnaire: string	// 调查问卷URL
	> >
	> ```

- ### 编辑用户昵称

	> #### request:
	> ``` ruby
	> url: /user/editNickName,
	> data: object <
	> 	nickname: string	// 昵称应有限制，建议长度为 20 。
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: undefined
	> ```


- ### 获取手机验证码

	> #### request:
	> ``` ruby
	> url: /user/getVerificationCode,
	> data: {
	> 	mobilePhone: string	// 有 token 时不需要手机号，没 token 时一定要手机号。
	> }
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: undefined
	> ```

- ### 校验手机验证码

	> #### request:
	> ``` ruby
	> url: /user/checkVerificationCode,
	> data: object <
	> 	mobilePhone: string,	// 有 token 时不需要手机号，没 token 时一定要手机号。
	> 	verificationCode: string
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: undefined
	> ```

- ### 编辑用户密码(通过手机验证码才能编辑)

	> #### request:
	> ``` ruby
	> url: /user/editPassword,
	> data: object <
	> 	mobilePhone: string,	// 有 token 时不需要手机号，没 token 时一定要手机号。
	> 	password: string	// 密码应有限制，限制后端自定
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: undefined
	> ```

- ### 获取系统／同伴储蓄反馈消息（根据 token 判断管理员／用户身份，管理员返回 type 为 0 的消息列表， 用户返回 type 为 0 和 1 的消息列表）

	> #### request:
	> ``` ruby
	> url: /message/getMessages,
	> data: object <
	> 	group: enum(0, 1, 2, 3),	// token 为管理员要填， token 为用户不填。
	> 	startNum: number,
	> 	pageSize: number
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object<
	> 	messages: array <
	> 		object <
	> 			_id: string,
	> 			type: enum(0, 1),	// 0 是系统消息，1 是同伴消息；token 为管理员不返回， token 为用户要返回。
	> 			userId: string,	// 如果 type 为 0 不返回
	> 			avatar: string,	// 如果是 type 为 0 不返回，由前端设置默认头像
	> 			nickname: string,	// 如果 type 为 0 不返回，由前端设置默认 nickname
	> 			date: string,	// 消息发布的时间。格式：2013-11-04
	> 			content: string,	// 消息正文，如果是同伴消息返回“您收到同伴储蓄情况反馈，点击查看”,
	> 			read: boolean	// 消息状态，true 为已读，false 为未读; token 为管理员不返回，token 为用户时要返回。
	> 		> * n
	> 	>,
	> 	count: number // 当前分组消息总数， token 为管理员时返回， token 为用户时不返回
	> >
	> ```

- ### 是否有新消息

	> #### request:
	> ``` ruby
	> url: /message/hasNewMessages,
	> data: undefined
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: {
	> 	hasNewMessages: boolean
	> }
	> ```

- ### 是否通过测试

	> #### request:
	> ``` ruby
	> url: /user/hasPassedTheExam,
	> data: undefined
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	hasPassedTheExam: boolean
	> >
	> ```

- ### 阅读消息

	> #### request:
	> ``` ruby
	> url: /message/readMessage,
	> data: {
	> 	_id: string
	> }
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: undefined
	> ```

- ### 获取累计储蓄总额

	> #### request:
	> ``` ruby
	> url: /savingsSituation/getTotalSavings,
	> data: undefined
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	totalSavings: number	// 累计储蓄总额，即历史储蓄总额之和（null 算 0），1，2 组要算上子女历史储蓄总额之和。
	> >
	> ```

- ### 通过测试 (将 hasPassedTheExam 置为 true)

	> #### request:
	> ``` ruby
	> url: /user/passTheExam,
	> data: undefined
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: undefined
	> ```

- ### 编辑用户头像（数据格式注意是formdata而不是json）

	> #### request:
	> ``` ruby
	> url: /user/editAvatar,
	> data: object <
	> 	avatar: string	// 头像图片的 base64 编码。
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: undefined
	> ```

- ### 添加系统消息

	> #### request:
	> ``` ruby
	> url: /message/addSystemMessage,
	> data: object <
	> 	content: string,
	> 	group: enum(0, 1, 2, 3)
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: undefined
	> ```

- ### 获取问卷调查链接(需要token)

	> #### request:
	> ``` ruby
	> url: /user/getQuestionnaireURL,
	> data: undefined
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	questionnaireURL: string
	> >
	> ```

- ### 编辑问卷调查链接(需要管理员token)

	> #### request:
	> ``` ruby
	> url: /user/editQuestionnaireURL,
	> data: object <
	> 	questionnaireURL: string
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: undefined
	> ```

- ### 获取咨询电话(需要token)

	> #### request:
	> ``` ruby
	> url: /user/getAdvisoryPhone,
	> data: undefined
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	advisoryPhone: string
	> >
	> ```

- ### 管理员获取用户储蓄情况(需要管理员token)

	> #### request:
	> ``` ruby
	> url: /savingsSituation/getUsersSavingsSituations,
	> data: object <
	> 	group: enum(0, 1, 2, 3),
	> 	startNum: number,
	> 	pageSize: number
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	usersSavingsSituations: array <
	> 		object <
	> 			_id: string,	// 用户ID
	> 			mobilePhone: string,	// 手机号
	> 			name: string,	// 姓名
	> 			eachMonthIncome: number,	// 每月收入
	> 			eachMonthOutcome: number,	// 每月支出
	> 			eachMonthRecommendSavings: number,	// 每月建议储蓄额
	> 			eachMonthExpectedSavings: number,	// 每月期望储蓄额
	> 			LatestActualSavings: number,	// 最新实际储蓄额,
	> 			achieveExpectation: boolean,	// 是否达成储蓄目标,
	> 			group: enum(0, 1, 2, 3)	// 分组
	> 		> * n
	> 	>,
	> 	count: number
	> >
	> ```

- ### 管理员所搜指定条件用户储蓄情况(需要管理员token)

	> #### request:
	> ``` ruby
	> url: /savingsSituation/searchUsersSavingsSituations,
	> data: object <
	> 	type: enum(0, 1),	// 0 表示手机号，1 表示姓名。
	> 	content: string		// 搜索内容。
	> >
	> ```
	> #### response:
	> ``` ruby
	> statusCode: enum(100, 101),
	> message: string,
	> result: object <
	> 	usersSavingsSituations: array <
	> 		object <
	> 			_id: string,	// 用户ID
	> 			mobilePhone: string,	// 手机号
	> 			name: string,	// 姓名
	> 			eachMonthIncome: number,	// 每月收入
	> 			eachMonthOutcome: number,	// 每月支出
	> 			eachMonthRecommendSavings: number,	// 每月建议储蓄额
	> 			eachMonthExpectedSavings: number,	// 每月期望储蓄额
	> 			LatestActualSavings: number,	// 最新实际储蓄额,
	> 			achieveExpectation: boolean,	// 是否达成储蓄目标,
	> 			group: enum(0, 1, 2, 3)	// 分组
	> 		> * n
	> 	>
	> >
	> ```
