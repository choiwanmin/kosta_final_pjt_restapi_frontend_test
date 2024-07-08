export default function CreateChatroom(){
    return (
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
	  <div class="modal-dialog modal-dialog-centered mem_modal">
	    <div class="modal-content">
	      <div class="modal-header">
	        <h5 class="modal-title" id="exampleModalLabel">멤버 선택</h5>
	        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
	      </div>
	      <div class="modal-body">
	        <form class="list_line" method="post">
	          <table class="m20 table_w100">
	            <tr>
	              <td>
	                <select class="select_box" name="type">
	                  <option value="1">부서이름</option>
	                  <option value="2">직원이름</option>
	                  <option value="3">직급</option>
	                </select>
	              </td>
	              <td class="list_search_wrapper">
	                <input class="list_input" type="text" name="val"/>
					<button type="button" class="btn blue_btn list_search_chat" onclick="list_search_chat('0')">검색</button>
	              </td>
	            </tr>
	          </table>
	        </form>
	        <form class="modal_list" action="/chat/chatroom">
	          <div class="modal_table_wrapper">
	          <table class="table_w100 modal_table">
	            <thead class="list_line ">
	            <tr>
	              <td><input type="checkbox"/></td>
	              <td class="w40 f600">Name</td>
	              <td class="f600">E-mail</td>
	            </tr>
	            </thead>
	            <tbody class="modal_body">
	            </tbody>
	          </table>
	        </div>
	          <div class="modal-footer">
	            <input type="submit" value="선택" class="btn blue_btn"/>
	            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
	          </div>
	        </form>
	      </div>
	    </div>
	  </div>
	</div>
    )
}