uint64 timestamp    # timestamp;  unit us;
int32 num           # -1: invaild; 0: none; 
int32[] type        # -1: invaild; 0: unknown; 1: perpendicular; 2: parallel; 3: oblique 30; 4: oblique 45;5: oblique 60; .etc
int32[] state       # -1: invaild; 0: unknown; 1: free; 2: occupy; 3:special; 4:private; .etc
uint32[] point_a_x  # 0~511; unit pixel;
uint32[] point_a_y  # 0~511; unit pixel;
uint32[] point_b_x  # 0~511; unit pixel;
uint32[] point_b_y  # 0~511; unit pixel;
uint32[] point_c_x  # 0~511; unit pixel;
uint32[] point_c_y  # 0~511; unit pixel;
uint32[] point_d_x  # 0~511; unit pixel;
uint32[] point_d_y  # 0~511; unit pixel;


