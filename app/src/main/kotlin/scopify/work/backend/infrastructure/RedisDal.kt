package scopify.work.backend.infrastructure

import com.github.salomonbrys.kotson.fromJson
import com.google.gson.Gson
import redis.clients.jedis.JedisPool
import redis.clients.jedis.JedisPoolConfig
import scopify.work.backend.model.IScopeRepository
import scopify.work.backend.model.ScopeGroup
import scopify.work.backend.model.ScopeSession
import java.net.URI

private val pool: JedisPool = createJedisPool()

class RedisDal : IScopeRepository {
    // Expire after one week
    private val expiry = 60 * 60 * 24 * 7

    private fun sessionKey(id: String) = "session:$id"
    private fun groupSessionsKey(id: String) = "group:$id:children"
    private fun groupKey(id: String) = "group:$id"

    private fun setExpiry(id: String) = pool.resource.use { pool -> pool.expire(sessionKey(id), expiry) }

    override fun getSession(id: String): ScopeSession? {
        pool.resource.use { pool ->
            val session = Gson().fromJson<ScopeSession>(
                pool.get(sessionKey(id))
                    ?: return null
            )
            setExpiry(id)
            return session
        }
    }

    override fun getGroup(id: String): ScopeGroup? {
        pool.resource.use { pool ->
            val group = Gson().fromJson<ScopeGroup>(
                pool.get(groupKey(id))
                    ?: return null
            )
            pool.expire(groupKey(id), expiry)
            return group
          }
    }

    override fun createGroup(id: String, title: String): ScopeGroup? {
      pool.resource.use { pool ->
        val group = ScopeGroup(id, title)

        val serialisedGroup = Gson().toJson(group)
        pool.set(groupKey(id), serialisedGroup)
        pool.expire(groupKey(id), expiry)

        return group
      }
    }

    override fun writeSession(session: ScopeSession) {
        pool.resource.use { pool ->
            val sessionJson = Gson().toJson(session)
            pool.set(sessionKey(session.id), sessionJson)
            setExpiry(session.id)

            if (session.group != null) {
              pool.lpush(groupSessionsKey(session.group), session.id)
            }
        }
    }

    override fun getGroupScopes(id: String): List<String> {
      pool.resource.use { pool ->
        return pool.lrange(groupSessionsKey(id), 0, -1)
      }
    }
}

fun createJedisPool(): JedisPool {
    val redisUrl = URI.create(
        System.getenv("REDIS_URL")
            ?: "redis://localhost:6379"
    )

    val poolConfig = JedisPoolConfig().apply {
        maxTotal = 10
        maxIdle = 5
        testOnBorrow = true
        testOnReturn = true
        testWhileIdle = true
    }

    return JedisPool(poolConfig, redisUrl)
}
